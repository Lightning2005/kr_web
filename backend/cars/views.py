from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car, Brand, CarModel, CarImage
from .serializers import CarSerializer, BrandSerializer, CarModelSerializer, MyTokenObtainPairSerializer
from .filters import CarFilter
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import action
from rest_framework.response import Response

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter
    ]
    filterset_class = CarFilter

    search_fields = ['car_model__name', 'description']
    ordering_fields = ['price', 'year', 'mileage']
    ordering = ['-created_at']

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        # Сначала сохраняем текстовые поля
        instance = serializer.save()
        # Затем вызываем обработку новых картинок
        self._handle_images(instance)

    def _handle_images(self, instance):
        # Получаем список файлов из ключа 'new_images'
        new_images = self.request.FILES.getlist('new_images')
        for image in new_images:
            CarImage.objects.create(car=instance, image=image)

    @action(detail=True, methods=['post'], url_path='delete-image')
    def delete_image(self, request, pk=None):
        image_id = request.data.get('image_id')
        try:
            image = CarImage.objects.get(id=image_id, car__id=pk)
            image.delete()
            return Response({'status': 'photo deleted'}, status=200)
        except CarImage.DoesNotExist:
            return Response({'error': 'Photo not found'}, status=404)

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class CarModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['brand']

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer