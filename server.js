const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Görsel yükleme için multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // images klasörü yoksa oluştur
        const dir = path.join(__dirname, 'images');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'images/');
    },
    filename: function(req, file, cb) {
        // Benzersiz dosya adı oluştur
        const uniqueFileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

const fileFilter = (req, file, cb) => {
    // Sadece görsel dosyalarını kabul et
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece görsel dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB
    }
});

// Statik dosyaları sunmak için
app.use(express.static('./'));
app.use('/images', express.static(path.join(__dirname, 'images')));

// JSON verilerini işlemek için
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Font Awesome için yönlendirme
app.get('/fontawesome', (req, res) => {
    res.redirect('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
});

// Admin sayfası
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Detay sayfası
app.get('/model/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'model_detay.html'));
});

// Görsel yükleme endpoint'i
app.post('/api/upload-images', upload.array('images', 10), (req, res) => {
    try {
        const uploadedFiles = req.files.map(file => `/images/${file.filename}`);
        res.json({ 
            success: true, 
            imagePaths: uploadedFiles 
        });
    } catch (error) {
        console.error('Görsel yükleme hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Görsel yüklenirken bir hata oluştu' 
        });
    }
});

// Belirli bir model bilgisini getir
app.get('/api/models/:id', (req, res) => {
    try {
        if (!fs.existsSync('models.json')) {
            return res.status(404).json({ error: 'Modeller bulunamadı' });
        }
        
        const models = JSON.parse(fs.readFileSync('models.json', 'utf8'));
        const model = models.find(m => m.id === req.params.id);
        
        if (!model) {
            return res.status(404).json({ error: 'Model bulunamadı' });
        }
        
        res.json(model);
    } catch (err) {
        console.error('Model bilgisi okunamadı:', err);
        res.status(500).json({ error: 'Model bilgisi okunamadı' });
    }
});

// Tüm modelleri getir
app.get('/api/models', (req, res) => {
    try {
        if (!fs.existsSync('models.json')) {
            fs.writeFileSync('models.json', '[]');
        }
        
        const models = fs.readFileSync('models.json', 'utf8');
        res.json(JSON.parse(models));
    } catch (err) {
        console.error('Modeller okunamadı:', err);
        res.status(500).json({ error: 'Modeller okunamadı' });
    }
});

// Modelleri kaydet
app.post('/api/models', (req, res) => {
    try {
        const models = req.body;
        fs.writeFileSync('models.json', JSON.stringify(models, null, 2));
        res.status(200).json({ message: 'Modeller başarıyla kaydedildi' });
    } catch (err) {
        console.error('Modeller kaydedilemedi:', err);
        res.status(500).json({ error: 'Modeller kaydedilemedi' });
    }
});

// Görsel silme endpoint'i (Kullanılmayan görselleri temizlemek için)
app.delete('/api/delete-image', (req, res) => {
    try {
        const { imagePath } = req.body;
        
        if (!imagePath || !imagePath.startsWith('/images/')) {
            return res.status(400).json({ 
                success: false, 
                error: 'Geçersiz görsel yolu' 
            });
        }
        
        const filePath = path.join(__dirname, imagePath);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Görsel silme hatası:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Görsel silinirken bir hata oluştu' 
        });
    }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
}); 