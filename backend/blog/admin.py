from django.contrib import admin
from .models import AboutProfile, AuditLog, BlogPost, Category


@admin.register(AboutProfile)
class AboutProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'city', 'profession', 'updated_at')
    search_fields = ('full_name', 'city', 'profession')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'created_at', 'updated_at')
    list_filter = ('section',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'section', 'category', 'is_published', 'created_at')
    list_filter = ('section', 'is_published', 'category')
    search_fields = ('title', 'summary', 'content')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'model_name', 'object_id', 'username', 'created_at')
    list_filter = ('action', 'model_name')
    search_fields = ('username', 'detail')
    readonly_fields = ('action', 'model_name', 'object_id', 'username', 'detail', 'created_at')
