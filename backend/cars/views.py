from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Car, Brand, CarModel, CarImage  # Добавил CarImage
from .serializers import CarSerializer, BrandSerializer, CarModelSerializer, MyTokenObtainPairSerializer
from .filters import CarFilter
from rest_framework_simplejwt.views import TokenObtainPairView

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

    def perform_create(self, serializer):
        # Сохраняем машину и назначаем владельца
        instance = serializer.save(owner=self.request.user)
        # Логика для галереи при создании
        self._handle_images(instance)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Логика для галереи при редактировании (PATCH)
        self._handle_images(instance)
        return super().partial_update(request, *args, **kwargs)

    def _handle_images(self, instance):
        """Вспомогательный метод для обработки новых изображений"""
        new_images = self.request.FILES.getlist('new_images')
        if new_images:
            for image in new_images:
                CarImage.objects.create(car=instance, image=image)

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