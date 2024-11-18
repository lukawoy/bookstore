import csv
import shutil
import os

from django.conf import settings
from django.core.management import BaseCommand

from books.models import Book, Author

TABLES = {
    Author: 'Authors.csv',
    Book: 'Books.csv',
}

source_directory = f'{settings.BASE_DIR}/inital_data/images'
destination_directory = f'{settings.BASE_DIR}/media/books/images'


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        # Загрузка данных из .csv
        for model, csv_file in TABLES.items():
            path_file = f'{settings.BASE_DIR}/inital_data/{csv_file}'
            with open(path_file, mode='r', encoding='Windows-1251') as file:
                reader = csv.DictReader(file)
                model_objects = []
                for row in reader:
                    if model == Book:
                        current_model = model.objects.create(
                            title=row['title'],
                            description=row['description'],
                            image=row['image'],
                            release_date=row['release_date'],
                            price=row['price'],
                        )
                        current_model.author.set(row['author'])
                    else:
                        model_objects.append(model(**row))
                if model == Author:
                    model.objects.bulk_create(model_objects)
                self.stdout.write(self.style.SUCCESS(
                    f'Data imported from {csv_file} into {model.__name__}'
                ))

        self.stdout.write(self.style.SUCCESS(
            'All data has been imported successfully'
        ))

        # Копирование картинок
        os.makedirs(destination_directory, exist_ok=True)

        for filename in os.listdir(source_directory):
            source_file = os.path.join(source_directory, filename)
            destination_file = os.path.join(destination_directory, filename)

            if os.path.isfile(source_file):
                shutil.copy(source_file, destination_file)
                print(f'Скопирован файл: {source_file} -> {destination_file}')
