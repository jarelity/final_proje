# Kişisel Blog Web Sitesi

Bu proje Web Programlama dersi için hazırlanmış kişisel blog web sitesidir. Sistem; **Angular frontend**, **Django REST API backend** ve **PostgreSQL veritabanı** kurgusuyla geliştirilmiştir.

## Proje Özeti

Normal kullanıcı siteyi ziyaret ederek içerikleri sadece okuyabilir. Yetkili kullanıcı giriş yaptıktan sonra yönetim panelinden aşağıdaki içerikleri ekleyebilir, güncelleyebilir ve silebilir:

- Hakkımda
- Teknik Bilgi
- Teknik Olmayan Bilgi
- Araştırmalarım
- Hobilerim
- Okuduğum Kitaplar

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | Angular 17 |
| Backend | Django 5 + Django REST Framework |
| Veritabanı | PostgreSQL |
| Kimlik Doğrulama | JWT / SimpleJWT |
| API Dokümantasyonu | Swagger / drf-spectacular |
| API Test | Postman Collection |
| Versiyon Kontrol | Git / GitHub |

## Klasör Yapısı

```text
kisisel-blog-projesi-final/
├── backend/                 # Django REST API
├── frontend/                # Angular arayüz
├── docs/                    # Kullanıcı, analiz ve geliştirici dokümanları
├── diagrams/                # Use-case ve aktivite diyagramları
├── postman/                 # Postman API koleksiyonu
├── docker-compose.yml       # PostgreSQL + isteğe bağlı servisler
└── README.md
```

## 1. Veritabanını Başlatma

Bilgisayarda Docker Desktop açıkken proje ana klasöründe çalıştır:

```bash
docker compose up -d db
```

Bu komut PostgreSQL veritabanını başlatır.

## 2. Backend Kurulumu

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo
python manage.py runserver
```

Mac/Linux için sanal ortam aktivasyonu:

```bash
source venv/bin/activate
```

Backend adresleri:

- API: `http://127.0.0.1:8000/api/`
- Swagger: `http://127.0.0.1:8000/api/docs/`
- Django Admin: `http://127.0.0.1:8000/admin/`

## 3. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

Frontend adresi:

```text
http://localhost:4200
```

## 4. Test Kullanıcı Bilgisi

`createsuperuser` komutunda kendi yetkili kullanıcını oluşturabilirsin. Demo verileri için `seed_demo` komutu örnek içerikler oluşturur.

## 5. API Testi

Postman klasörü içinde bulunan `kisisel_blog_api.postman_collection.json` dosyasını Postman'e import et. Login isteğiyle JWT token alıp diğer yetkili isteklerde kullanabilirsin.

## 6. GitHub'a Yükleme

```bash
git init
git add .
git commit -m "Kişisel blog projesi tamamlandı"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/kisisel-blog-projesi.git
git push -u origin main
```

## 7. Yayına Alma Önerisi

- Backend: Render / Railway / PythonAnywhere
- Frontend: Netlify / Vercel
- Veritabanı: Render PostgreSQL / Railway PostgreSQL

Yayına alınca `frontend/src/environments/environment.ts` içindeki API adresi canlı backend URL'si ile değiştirilmelidir.

## Kontrol Listesi

- [x] Angular frontend
- [x] Django backend
- [x] PostgreSQL veritabanı
- [x] Normal kullanıcı okuma ekranı
- [x] Yetkili kullanıcı yönetim paneli
- [x] Hakkımda CRUD
- [x] Kategori CRUD
- [x] Blog yazısı CRUD
- [x] JWT login
- [x] Swagger API dokümantasyonu
- [x] Postman collection
- [x] Kullanıcı dokümanı
- [x] Geliştirici dokümanı
- [x] Ürün analiz dokümanı
- [x] GitHub'a yüklenebilir proje yapısı
