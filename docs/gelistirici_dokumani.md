# Geliştirici Dokümanı - Kişisel Blog Web Sitesi

## Mimari

Proje üç ana katmandan oluşur:

1. Angular frontend: Kullanıcı arayüzü ve yönetim paneli.
2. Django REST backend: API endpointleri, yetkilendirme ve iş kuralları.
3. PostgreSQL veritabanı: Hakkımda, kategori, blog yazısı ve denetim kayıtlarını saklar.

## Backend Endpointleri

| Endpoint | Açıklama | Yetki |
|---|---|---|
| GET /api/sections/ | Bölüm listesini verir | Herkes |
| GET /api/about/current/ | Güncel hakkımda bilgisini verir | Herkes |
| POST /api/about/ | Hakkımda oluşturur | Staff |
| PATCH /api/about/{id}/ | Hakkımda günceller | Staff |
| GET /api/categories/ | Kategori listesi | Herkes |
| POST /api/categories/ | Kategori ekler | Staff |
| PATCH /api/categories/{id}/ | Kategori günceller | Staff |
| DELETE /api/categories/{id}/ | Kategori siler | Staff |
| GET /api/posts/?published=true | Yayınlanmış yazıları getirir | Herkes |
| POST /api/posts/ | Blog yazısı ekler | Staff |
| PATCH /api/posts/{id}/ | Blog yazısı günceller | Staff |
| DELETE /api/posts/{id}/ | Blog yazısı siler | Staff |
| POST /api/token/ | JWT token alır | Kullanıcı |
| GET /api/docs/ | Swagger arayüzü | Herkes |

## İş Kuralları

- Normal kullanıcı sadece GET istekleri yapabilir.
- POST, PATCH, DELETE işlemleri için kullanıcı giriş yapmış ve staff olmalıdır.
- Blog yazısına seçilen kategori, yazının bölümü ile aynı bölümde olmalıdır.
- Kategori adı aynı bölüm içinde tekil olmalıdır.
- Görsel yükleme için multipart/form-data desteklenir.

## Çalıştırma

```bash
docker compose up -d db
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

```bash
cd frontend
npm install
npm start
```

## Test

```bash
cd backend
python manage.py test
```

## Yayına Alma

Backend Render/Railway/PythonAnywhere üzerinde yayınlanabilir. Frontend Vercel/Netlify üzerinde build edilerek yayınlanabilir. Canlı yayında `environment.prod.ts` dosyasındaki `apiUrl` canlı backend URL'si ile değiştirilmelidir.
