from rest_framework import serializers
from .models import AboutProfile, AuditLog, BlogPost, Category, SectionChoices


def get_section_payload():
    return [{'value': value, 'label': label} for value, label in SectionChoices.choices]


class CategorySerializer(serializers.ModelSerializer):
    section_label = serializers.CharField(source='get_section_display', read_only=True)
    post_count = serializers.SerializerMethodField()

    def get_post_count(self, obj):
        return getattr(obj, 'post_count', obj.posts.count())

    class Meta:
        model = Category
        fields = [
            'id', 'section', 'section_label', 'name', 'slug', 'description',
            'post_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']


class AboutProfileSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = AboutProfile
        fields = [
            'id', 'full_name', 'age', 'city', 'profession', 'linkedin_url',
            'github_url', 'description', 'photo', 'photo_url', 'updated_at'
        ]
        read_only_fields = ['updated_at', 'photo_url']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and hasattr(obj.photo, 'url'):
            url = obj.photo.url
            return request.build_absolute_uri(url) if request else url
        return None


class BlogPostSerializer(serializers.ModelSerializer):
    section_label = serializers.CharField(source='get_section_display', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'section', 'section_label', 'category', 'category_name',
            'title', 'slug', 'summary', 'content', 'image', 'image_url',
            'is_published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            url = obj.image.url
            return request.build_absolute_uri(url) if request else url
        return None

    def validate(self, attrs):
        category = attrs.get('category') or getattr(self.instance, 'category', None)
        section = attrs.get('section') or getattr(self.instance, 'section', None)
        if category and section and category.section != section:
            raise serializers.ValidationError('Seçilen kategori bu bölüme ait değildir.')
        return attrs


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ['id', 'action', 'model_name', 'object_id', 'username', 'detail', 'created_at']
        read_only_fields = fields
