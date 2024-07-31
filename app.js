import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fileUpload from 'express-fileupload';
import { fileTypeFromBlob } from 'file-type';

function getFileExtension(mimeType) {
  const extensions = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpeg',
    'text/plain': 'txt',
    'image/png': 'png'
    
    // Add more MIME types and their extensions here
  };

  return extensions[mimeType] || 'unknown';
}

dotenv.config();
const app = express();
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

const port = process.env.PORT || 5000;

// Database setup
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Endpoint to get folders and documents
app.post('/api/getData', async (req, res) => {
  try {
    const { menu_name } = req.body;
    const sqlGetFolders = 'SELECT * FROM folders WHERE menu_name = ?';
    const sqlGetDocuments = `
      SELECT id, name, icon, folder_name, menu_name, file
      FROM documents
      WHERE menu_name = ? OR folder_name IN (SELECT name FROM folders WHERE menu_name = ?)
    `;

    const [folders] = await db.query(sqlGetFolders, [menu_name]);
    const [documents] = await db.query(sqlGetDocuments, [menu_name, menu_name]);

    res.json({ folders, documents });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Endpoint to add a document or folder
app.post('/api/postDocument', async (req, res) => {
  try {
    const { file_type, name, menu, folder_name } = req.body;

    if (!file_type || !name || !menu) {
      return res.status(400).json({ message: 'File type, name, and menu are required' });
    }

    if (file_type === 'Document') {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'A document file is required' });
      }

      const file = req.files.file;

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' });
      }

      const query = 'INSERT INTO documents (file_type, name, menu_name, folder_name, file) VALUES (?,?,?,?,?)';
      await db.query(query, [file_type, name, menu, folder_name, file.data]);

      res.json({ message: 'File uploaded and document data inserted successfully', document: { file_type, name, menu, folder_name } });
    } else if (file_type === 'Folder') {
      const query = 'INSERT INTO folders (name, menu_name) VALUES (?,?)';
      await db.query(query, [name, menu]);

      res.json({ message: 'Folder created successfully', folder: { name, menu } });
    } else {
      res.status(400).json({ message: 'Invalid file type' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to serve a document by ID

app.get('/api/document/:id', async (req, res) => {
  try {
    const docId = req.params.id;
    const query = 'SELECT * FROM documents WHERE id = ?';
    const [results] = await db.query(query, [docId]);

    if (results.length > 0) {
      const document = results[0];
      const fileBuffer = document.file; // Ensure this is a Buffer

      if (!Buffer.isBuffer(fileBuffer)) {
        console.error('Expected a Buffer but received:', fileBuffer);
        return res.status(500).send('Internal Server Error');
      }

      // Convert Buffer to Blob
      const blob = new Blob([fileBuffer]);

      // Detect MIME type from Blob
      const type = await fileTypeFromBlob(blob);

      if (type && type.mime) {
        const ext = getFileExtension(type.mime);
        res.setHeader('Content-Type', type.mime);
        res.send(fileBuffer);
      } else {
        // Handle plain text specifically if not detected by file-type
        res.setHeader('Content-Type', 'text/plain');
        res.send(fileBuffer);
      }
    } else {
      res.status(404).send('Document not found');
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server error');
  }
});


// get all the folders
app.get('/api/folders', async (req, res) => {
  try {
    const query = 'SELECT * FROM folders';
    const [results] = await db.query(query);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching folders' });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Server
app.listen(port, () => {
  console.log(`App is running on port: http://localhost:${port}`);
});


