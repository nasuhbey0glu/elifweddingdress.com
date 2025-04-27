# ElifWeddingdress - Gelinlik Modelleri Web Sitesi

Bu proje, ElifWeddingdress gelinlik mağazası için bir web sitesi uygulamasıdır. Kullanıcılar gelinlik modellerini görüntüleyebilir, admin kullanıcılar yeni modeller ekleyebilir, düzenleyebilir ve silebilir.

## Özellikler

- Gelinlik modellerini koleksiyon halinde gösterme
- Her model için detay sayfası
- Çoklu görsel desteği
- Bedenler ve fiyat bilgileri
- Instagram bağlantısı
- Admin paneli ile model yönetimi

## Kurulum

1. Bu projeyi bilgisayarınıza klonlayın veya indirin
2. Gerekli bağımlılıkları yükleyin:

```bash
npm install
```

3. Sunucuyu başlatın:

```bash
npm start
```

4. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyin

## Dosya Yapısı

- `index.html` - Ana sayfa
- `admin.html` - Admin paneli
- `model_detay.html` - Model detay sayfası
- `server.js` - Express sunucusu
- `models.json` - Model verileri
- `images/` - Yüklenen görseller için klasör

## Teknik Detaylar

Bu web sitesi Node.js ve Express.js ile oluşturulmuştur. Görseller, `multer` kütüphanesi kullanılarak sunucu tarafında `images` klasörüne kaydedilir. Model verileri `models.json` dosyasında saklanır.

### Görsel Yükleme

Model ekleme veya düzenleme sırasında yüklenen görseller:

1. `multer` kütüphanesi ile işlenir
2. `images` klasörüne benzersiz isimlerle kaydedilir
3. Görsel yolları models.json dosyasına kaydedilir

Bu sayede görseller tarayıcı önbelleğinde saklanabilir ve farklı cihazlardan da erişilebilir.

## Geliştirme

Geliştirme modunda çalıştırmak için:

```bash
npm run dev
```

Bu komut, `nodemon` kullanarak sunucuyu çalıştırır ve dosya değişikliklerinde otomatik olarak yeniden başlatır. 