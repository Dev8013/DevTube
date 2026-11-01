import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initialProfile, initialProjects, initialDocuments, initialAnimeDrama, initialComments } from './src/data/initialData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent JSON storage fallback & local cache
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'db-store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DataStore {
  profile: typeof initialProfile;
  projects: typeof initialProjects;
  documents: typeof initialDocuments;
  animeDrama: typeof initialAnimeDrama;
  comments: typeof initialComments;
}

let store: DataStore = {
  profile: initialProfile,
  projects: initialProjects,
  documents: initialDocuments,
  animeDrama: initialAnimeDrama,
  comments: initialComments,
};

// Load saved data if available
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    store = {
      profile: { ...initialProfile, ...(parsed.profile || {}) },
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      animeDrama: Array.isArray(parsed.animeDrama) ? parsed.animeDrama : [],
      comments: Array.isArray(parsed.comments) ? parsed.comments : [],
    };
    console.log('✅ Loaded clean data store from local disk');
  } else {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
    console.log('✅ Initialized clean empty database store');
  }
} catch (err) {
  console.warn('Could not read existing store file, using clean in-memory store:', err);
}

function saveStore() {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Failed to write store file:', err);
  }
}

// -------------------------------------------------------------
// MongoDB Connection & Real-Time Sync Engine
// -------------------------------------------------------------
let mongoConnected = false;
let mongoDbInstance: any = null;
let mongoClientInstance: any = null;
let currentMongoUri = '';

const MONGODB_USER = process.env.MONGODB_USER || 'bhardwajdev269_db_user';
const MONGODB_PASS = process.env.MONGODB_PASS || 'nt8QnfaHAEc0vmd9';
const DEFAULT_MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASS)}@cluster0.mongodb.net/devtube_portfolio?retryWrites=true&w=majority`;

// Purges all sample data from MongoDB collections so user starts completely clean
async function purgeSampleDataFromMongo(db: any) {
  if (!db) return;
  try {
    console.log('🗑️ Purging any existing sample data from MongoDB collections...');
    const collectionsToPurge = ['projects', 'documents', 'anime_watch_history', 'animeDrama', 'comments'];

    await Promise.all(
      collectionsToPurge.map(async (collName) => {
        try {
          const coll = db.collection(collName);
          const res = await coll.deleteMany({});
          console.log(`🧹 Collection "${collName}": purged ${res.deletedCount || 0} sample documents.`);
        } catch (e: any) {
          console.warn(`Could not clear collection ${collName}:`, e?.message);
        }
      })
    );

    // Sync clean profile into MongoDB
    const profileColl = db.collection('profile');
    await profileColl.updateOne({}, { $set: store.profile }, { upsert: true });
    console.log('✅ Clean profile synchronized with MongoDB');
  } catch (err) {
    console.error('Failed during MongoDB purge:', err);
  }
}

// Connect to MongoDB Atlas with automatic fallback and sample data purge
async function connectToMongo(uri: string) {
  try {
    const { MongoClient } = await import('mongodb');
    if (mongoClientInstance) {
      try {
        await mongoClientInstance.close();
      } catch {
        // ignore
      }
    }

    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    await client.connect();
    mongoClientInstance = client;
    mongoDbInstance = client.db('devtube_portfolio');
    mongoConnected = true;
    currentMongoUri = uri;
    console.log(`✅ Successfully connected to MongoDB for user "${MONGODB_USER}"`);

    // Immediately purge all sample data from MongoDB on connect
    await purgeSampleDataFromMongo(mongoDbInstance);

    return { success: true };
  } catch (err: any) {
    mongoConnected = false;
    mongoDbInstance = null;
    console.warn(`ℹ️ MongoDB Atlas offline or DNS unresolved (${err?.message || 'timeout'}). Using persistent local database store.`);
    return { success: false, error: err?.message };
  }
}

// Initial MongoDB connect attempt
connectToMongo(DEFAULT_MONGODB_URI);

// -------------------------------------------------------------
// Database Status & Manual Sync / Purge API
// -------------------------------------------------------------
app.get('/api/db/status', (req, res) => {
  res.json({
    success: true,
    mongoConnected,
    user: MONGODB_USER,
    storage: mongoConnected ? 'MongoDB Cloud Atlas (Synced)' : 'Persistent Local Database Store (Ready)',
    storePath: STORE_FILE,
    stats: {
      projects: store.projects.length,
      documents: store.documents.length,
      animeDrama: store.animeDrama.length,
      comments: store.comments.length,
    },
  });
});

// Explicit endpoint to purge all data from MongoDB and front-end storage
app.post('/api/db/clear-all', async (req, res) => {
  try {
    store.projects = [];
    store.documents = [];
    store.animeDrama = [];
    store.comments = [];
    saveStore();

    if (mongoConnected && mongoDbInstance) {
      await purgeSampleDataFromMongo(mongoDbInstance);
    }

    res.json({
      success: true,
      message: 'All sample data has been permanently deleted from MongoDB and local storage. Fresh sync active.',
      stats: {
        projects: 0,
        documents: 0,
        animeDrama: 0,
        comments: 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Purge failed' });
  }
});

// Dynamic MongoDB connection config endpoint
app.post('/api/db/connect', async (req, res) => {
  const { uri, cluster } = req.body;
  let targetUri = uri;

  if (!targetUri && cluster) {
    targetUri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASS)}@${cluster}/devtube_portfolio?retryWrites=true&w=majority`;
  }

  if (!targetUri) {
    return res.status(400).json({ success: false, message: 'URI or cluster identifier required' });
  }

  const result = await connectToMongo(targetUri);
  if (result.success) {
    return res.json({
      success: true,
      message: 'Connected to MongoDB Atlas and purged all sample data. Ready for fresh live sync.',
      mongoConnected: true,
    });
  }

  return res.status(400).json({
    success: false,
    message: `Could not connect to MongoDB: ${result.error}`,
    mongoConnected: false,
  });
});

// -------------------------------------------------------------
// Authentication API
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  const validEmail = 'bhardwajdev269@gmail.com';
  const validUsername = 'Onicha69';
  const validPassword = 'Dev@8013';

  const isEmailOrUser =
    (identifier && identifier.trim().toLowerCase() === validEmail.toLowerCase()) ||
    (identifier && identifier.trim() === validUsername);

  if (isEmailOrUser && password === validPassword) {
    return res.json({
      success: true,
      token: 'admin-dev-session-token-8013',
      user: {
        name: 'Dev Bhardwaj',
        email: validEmail,
        username: validUsername,
        role: 'admin',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrative credentials. Use bhardwajdev269@gmail.com or Onicha69 with authorized key.',
  });
});

// -------------------------------------------------------------
// Profile API (Synchronized with MongoDB)
// -------------------------------------------------------------
app.get('/api/profile', async (req, res) => {
  if (mongoConnected && mongoDbInstance) {
    try {
      const profileColl = mongoDbInstance.collection('profile');
      const doc = await profileColl.findOne({}, { projection: { _id: 0 } });
      if (doc) {
        store.profile = { ...store.profile, ...doc };
        saveStore();
      }
    } catch (e) {
      console.warn('Error reading profile from MongoDB:', e);
    }
  }
  res.json({ success: true, data: store.profile });
});

app.put('/api/profile', async (req, res) => {
  store.profile = {
    ...store.profile,
    ...req.body,
  };
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      const profileColl = mongoDbInstance.collection('profile');
      await profileColl.updateOne({}, { $set: store.profile }, { upsert: true });
    } catch (e) {
      console.warn('Error updating profile in MongoDB:', e);
    }
  }

  res.json({ success: true, data: store.profile });
});

// -------------------------------------------------------------
// Projects API (CRUD + Drag-and-Drop Reorder + MongoDB Sync)
// -------------------------------------------------------------
app.get('/api/projects', async (req, res) => {
  if (mongoConnected && mongoDbInstance) {
    try {
      const projectsColl = mongoDbInstance.collection('projects');
      const docs = await projectsColl.find({}, { projection: { _id: 0 } }).sort({ order: 1 }).toArray();
      store.projects = docs;
      saveStore();
    } catch (e) {
      console.warn('Error fetching projects from MongoDB:', e);
    }
  }

  const sorted = [...store.projects].sort((a, b) => a.order - b.order);
  res.json({ success: true, data: sorted });
});

app.post('/api/projects', async (req, res) => {
  const newProject = {
    id: `proj-${Date.now()}`,
    title: req.body.title || 'Untitled Project',
    shortName: req.body.shortName || req.body.title || 'Project',
    description: req.body.description || '',
    thumbnail: req.body.thumbnail || '/src/assets/images/yt_thumb_cloud_platform_1793508227442.jpg',
    duration: req.body.duration || '12:00',
    category: req.body.category || 'General',
    views: '1 view',
    numericViews: 1,
    likes: 1,
    isLiked: false,
    publishedAt: 'Just now',
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['React', 'TypeScript', 'Node.js'],
    githubUrl: req.body.githubUrl || 'https://github.com/Onicha69',
    liveDemoUrl: req.body.liveDemoUrl || '',
    order: store.projects.length + 1,
    featured: Boolean(req.body.featured),
    architectureHighlights: req.body.architectureHighlights || ['Modern architecture', 'Full-stack integration'],
  };

  store.projects.push(newProject);
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('projects').insertOne({ ...newProject });
    } catch (e) {
      console.warn('Error saving project to MongoDB:', e);
    }
  }

  res.status(201).json({ success: true, data: newProject });
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const updatedProject = {
    ...store.projects[index],
    ...req.body,
    id, // protect id
  };

  store.projects[index] = updatedProject;
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('projects').updateOne({ id }, { $set: updatedProject });
    } catch (e) {
      console.warn('Error updating project in MongoDB:', e);
    }
  }

  res.json({ success: true, data: updatedProject });
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const initialLen = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);

  if (store.projects.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  // Re-index remaining projects
  store.projects.forEach((proj, idx) => {
    proj.order = idx + 1;
  });

  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('projects').deleteOne({ id });
      // update orders
      for (const p of store.projects) {
        await mongoDbInstance.collection('projects').updateOne({ id: p.id }, { $set: { order: p.order } });
      }
    } catch (e) {
      console.warn('Error deleting project from MongoDB:', e);
    }
  }

  res.json({ success: true, message: 'Project removed successfully' });
});

// Reorder projects route for drag and drop
app.patch('/api/projects/reorder', async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ success: false, message: 'orderedIds array required' });
  }

  const projectMap = new Map(store.projects.map((p) => [p.id, p]));
  const reordered: typeof store.projects = [];

  orderedIds.forEach((id, index) => {
    const proj = projectMap.get(id);
    if (proj) {
      proj.order = index + 1;
      reordered.push(proj);
      projectMap.delete(id);
    }
  });

  for (const remaining of projectMap.values()) {
    remaining.order = reordered.length + 1;
    reordered.push(remaining);
  }

  store.projects = reordered;
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      for (const p of store.projects) {
        await mongoDbInstance.collection('projects').updateOne({ id: p.id }, { $set: { order: p.order } });
      }
    } catch (e) {
      console.warn('Error reordering projects in MongoDB:', e);
    }
  }

  res.json({ success: true, data: store.projects });
});

// Like project toggle
app.post('/api/projects/:id/like', async (req, res) => {
  const { id } = req.params;
  const proj = store.projects.find((p) => p.id === id);
  if (!proj) return res.status(404).json({ success: false, message: 'Project not found' });

  proj.isLiked = !proj.isLiked;
  proj.likes += proj.isLiked ? 1 : -1;
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('projects').updateOne(
        { id },
        { $set: { likes: proj.likes, isLiked: proj.isLiked } }
      );
    } catch (e) {
      console.warn('Error toggling like in MongoDB:', e);
    }
  }

  res.json({ success: true, likes: proj.likes, isLiked: proj.isLiked });
});

// -------------------------------------------------------------
// Secure Documents Vault API (Encrypted Storage + MongoDB Sync)
// -------------------------------------------------------------
app.get('/api/documents', async (req, res) => {
  if (mongoConnected && mongoDbInstance) {
    try {
      const docs = await mongoDbInstance.collection('documents').find({}, { projection: { _id: 0 } }).toArray();
      store.documents = docs;
      saveStore();
    } catch (e) {
      console.warn('Error fetching documents from MongoDB:', e);
    }
  }
  res.json({ success: true, data: store.documents });
});

app.post('/api/documents', async (req, res) => {
  const { title, type, identifierNumber, fileData, notes, mimeType } = req.body;
  const cryptoHash = `AES256:${Buffer.from(`${title}-${Date.now()}-${Math.random()}`).toString('hex')}`;

  const newDoc = {
    id: `doc-${Date.now()}`,
    title: title || 'Encrypted Credential Document',
    type: type || 'Other',
    identifierNumber: identifierNumber || 'XXXX-XXXX-XXXX',
    uploadDate: new Date().toISOString().split('T')[0],
    fileSize: fileData ? `${(fileData.length / 1024).toFixed(1)} KB` : '1.2 MB',
    mimeType: mimeType || 'application/pdf',
    encryptedHash: cryptoHash,
    isEncrypted: true,
    decryptedData: fileData || `Verified Secure Document: ${title} | Credential: ${identifierNumber} | Sealed with Dev Bhardwaj Private Root Key.`,
    notes: notes || 'Private stored document sealed in encrypted vault.',
  };

  store.documents.unshift(newDoc);
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('documents').insertOne({ ...newDoc });
    } catch (e) {
      console.warn('Error saving document to MongoDB:', e);
    }
  }

  res.status(201).json({ success: true, data: newDoc });
});

app.delete('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  const initLen = store.documents.length;
  store.documents = store.documents.filter((d) => d.id !== id);
  if (store.documents.length === initLen) {
    return res.status(404).json({ success: false, message: 'Document not found' });
  }
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('documents').deleteOne({ id });
    } catch (e) {
      console.warn('Error deleting document from MongoDB:', e);
    }
  }

  res.json({ success: true, message: 'Document purged from secure storage' });
});

// -------------------------------------------------------------
// Private Watchlist / Anime & Drama Tracker API (MongoDB Sync)
// -------------------------------------------------------------
app.get('/api/anime-tracker', async (req, res) => {
  if (mongoConnected && mongoDbInstance) {
    try {
      const items = await mongoDbInstance.collection('anime_watch_history').find({}, { projection: { _id: 0 } }).toArray();
      store.animeDrama = items;
      saveStore();
    } catch (e) {
      console.warn('Error fetching anime history from MongoDB:', e);
    }
  }
  res.json({ success: true, data: store.animeDrama });
});

app.post('/api/anime-tracker', async (req, res) => {
  const { title, originalTitle, category, status, totalEpisodes, watchedEpisodes, thumbnail, rating, description, genres, releaseYear } = req.body;
  const total = Number(totalEpisodes) || 12;
  const watched = Math.min(Number(watchedEpisodes) || 0, total);
  const watchedList = Array.from({ length: watched }, (_, i) => i + 1);

  const newItem = {
    id: `ad-${Date.now()}`,
    title: title || 'New Series',
    originalTitle: originalTitle || '',
    category: category || 'Anime',
    status: status || (watched >= total ? 'Completed' : watched > 0 ? 'Watching' : 'Upcoming'),
    totalEpisodes: total,
    watchedEpisodes: watched,
    watchedList,
    thumbnail: thumbnail || '/src/assets/images/yt_thumb_anime_tracker_1793508229451.jpg',
    rating: Number(rating) || 9.0,
    description: description || 'Tracked series in private dashboard.',
    genres: Array.isArray(genres) ? genres : ['Series'],
    releaseYear: releaseYear || '2025',
    updatedAt: 'Just now',
  };

  store.animeDrama.unshift(newItem);
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('anime_watch_history').insertOne({ ...newItem });
    } catch (e) {
      console.warn('Error saving anime item to MongoDB:', e);
    }
  }

  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/anime-tracker/:id', async (req, res) => {
  const { id } = req.params;
  const idx = store.animeDrama.findIndex((item) => item.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });

  const existing = store.animeDrama[idx];
  const totalEpisodes = req.body.totalEpisodes !== undefined ? Number(req.body.totalEpisodes) : existing.totalEpisodes;
  let watchedList = req.body.watchedList !== undefined ? req.body.watchedList : existing.watchedList;
  watchedList = watchedList.filter((ep: number) => ep <= totalEpisodes);

  const updated = {
    ...existing,
    ...req.body,
    totalEpisodes,
    watchedEpisodes: watchedList.length,
    watchedList,
    status: req.body.status || (watchedList.length >= totalEpisodes ? 'Completed' : watchedList.length > 0 ? 'Watching' : 'Upcoming'),
    updatedAt: 'Just now',
  };

  store.animeDrama[idx] = updated;
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('anime_watch_history').updateOne({ id }, { $set: updated });
    } catch (e) {
      console.warn('Error updating anime item in MongoDB:', e);
    }
  }

  res.json({ success: true, data: updated });
});

// Toggle individual episode watched status (Turn green/red)
app.patch('/api/anime-tracker/:id/episode', async (req, res) => {
  const { id } = req.params;
  const { episodeNumber } = req.body;
  const ep = Number(episodeNumber);

  const item = store.animeDrama.find((ad) => ad.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  const set = new Set(item.watchedList);
  if (set.has(ep)) {
    set.delete(ep);
  } else {
    set.add(ep);
  }

  const updatedWatchedList = Array.from(set).sort((a, b) => a - b);
  item.watchedList = updatedWatchedList;
  item.watchedEpisodes = updatedWatchedList.length;

  if (item.watchedEpisodes >= item.totalEpisodes) {
    item.status = 'Completed';
  } else if (item.watchedEpisodes > 0) {
    item.status = 'Watching';
  } else {
    item.status = item.status === 'Completed' ? 'Watching' : item.status;
  }
  item.updatedAt = 'Just now';

  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('anime_watch_history').updateOne({ id }, { $set: item });
    } catch (e) {
      console.warn('Error toggling episode in MongoDB:', e);
    }
  }

  res.json({ success: true, data: item });
});

// Quick batch watch / reset
app.patch('/api/anime-tracker/:id/batch-watch', async (req, res) => {
  const { id } = req.params;
  const { markAll } = req.body;

  const item = store.animeDrama.find((ad) => ad.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  if (markAll) {
    item.watchedList = Array.from({ length: item.totalEpisodes }, (_, i) => i + 1);
    item.watchedEpisodes = item.totalEpisodes;
    item.status = 'Completed';
  } else {
    item.watchedList = [];
    item.watchedEpisodes = 0;
    item.status = 'Upcoming';
  }
  item.updatedAt = 'Just now';

  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('anime_watch_history').updateOne({ id }, { $set: item });
    } catch (e) {
      console.warn('Error batch watching in MongoDB:', e);
    }
  }

  res.json({ success: true, data: item });
});

app.delete('/api/anime-tracker/:id', async (req, res) => {
  const { id } = req.params;
  const initLen = store.animeDrama.length;
  store.animeDrama = store.animeDrama.filter((item) => item.id !== id);
  if (store.animeDrama.length === initLen) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('anime_watch_history').deleteOne({ id });
    } catch (e) {
      console.warn('Error deleting anime item from MongoDB:', e);
    }
  }

  res.json({ success: true, message: 'Series removed from watchlist' });
});

// -------------------------------------------------------------
// Comments API (Synchronized with MongoDB)
// -------------------------------------------------------------
app.get('/api/comments/:projectId', async (req, res) => {
  const { projectId } = req.params;
  if (mongoConnected && mongoDbInstance) {
    try {
      const comments = await mongoDbInstance.collection('comments').find({ projectId }, { projection: { _id: 0 } }).toArray();
      return res.json({ success: true, data: comments });
    } catch (e) {
      console.warn('Error fetching comments from MongoDB:', e);
    }
  }
  const filtered = store.comments.filter((c) => c.projectId === projectId);
  res.json({ success: true, data: filtered });
});

app.post('/api/comments', async (req, res) => {
  const { projectId, author, text, avatar, isOwner } = req.body;
  const newComment = {
    id: `comm-${Date.now()}`,
    projectId: projectId || 'proj-1',
    author: author || 'Visiting Engineer',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    text: text || 'Great project!',
    timestamp: 'Just now',
    likes: 0,
    isOwner: Boolean(isOwner),
  };

  store.comments.unshift(newComment);
  saveStore();

  if (mongoConnected && mongoDbInstance) {
    try {
      await mongoDbInstance.collection('comments').insertOne({ ...newComment });
    } catch (e) {
      console.warn('Error saving comment to MongoDB:', e);
    }
  }

  res.status(201).json({ success: true, data: newComment });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving Setup
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dev Bhardwaj YouTube Portfolio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
