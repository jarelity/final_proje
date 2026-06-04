from django.conf import settings
from django.db import models
from django.utils.text import slugify


class SectionChoices(models.TextChoices):
    ABOUT = 'ABOUT', 'Hakkımda'
    TECHNICAL = 'TECHNICAL', 'Çektiğim Fotoğraflar'
    NON_TECHNICAL = 'NON_TECHNICAL', 'Gereksiz Bilgiler'
    RESEARCH = 'RESEARCH', 'Araştırmalarım'
    HOBBIES = 'HOBBIES', 'Hobilerim'
    BOOKS = 'BOOKS', 'Okuduğum Kitaplar'


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    section = models.CharField(max_length=30, choices=SectionChoices.choices)
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['section', 'name']
        constraints = [
            models.UniqueConstraint(fields=['section', 'name'], name='unique_category_per_section')
        ]
        verbose_name = 'Kategori'
        verbose_name_plural = 'Kategoriler'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.get_section_display()} - {self.name}'


class AboutProfile(models.Model):
    full_name = models.CharField(max_length=120)
    age = models.PositiveSmallIntegerField()
    city = models.CharField(max_length=80)
    profession = models.CharField(max_length=120)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    description = models.TextField()
    photo = models.ImageField(upload_to='about/', blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Hakkımda Profili'
        verbose_name_plural = 'Hakkımda Profilleri'

    def __str__(self):
        return self.full_name


class BlogPost(TimeStampedModel):
    section = models.CharField(max_length=30, choices=SectionChoices.choices)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=220, blank=True)
    summary = models.CharField(max_length=320, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Yazısı'
        verbose_name_plural = 'Blog Yazıları'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class AuditLog(models.Model):
    action = models.CharField(max_length=80)
    model_name = models.CharField(max_length=80)
    object_id = models.CharField(max_length=40, blank=True)
    username = models.CharField(max_length=150, blank=True)
    detail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Denetim Kaydı'
        verbose_name_plural = 'Denetim Kayıtları'

    def __str__(self):
        return f'{self.action} - {self.model_name} - {self.username}'
