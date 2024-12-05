### О проекте
«Bookstore» — это книжный интернет-магазин. Веб-сервис "Bookstore" предоставляет пользователям возможность просматривать книги, оставлять к ним отзывы и оценки, добавлять понравившиеся книги в корзину и избранное.

Сервис доступен по ссылке https://lukabookstore.hopto.org/

### Основные функции:

1.  **Поиск**: Пользователи могут легко находить книги по названию.
    
2.  **Подробные страницы книг**: Каждая книга имеет свою страницу с подробным описанием, включая аннотацию, информацию об авторе, отзывы других пользователей, рейтинг и цену.
    
3.  **Корзина и избранное**: Пользователи могут добавлять книги в избранное и/или корзину, и легко оформлять заказы. Процесс оформления заказа интуитивно понятен.
    
4.  **Личный кабинет**: У зарегистрированных пользователей есть личный кабинет, где они могут управлять списком избранного и корзины, оставлять отзывы и редактировать личные данные.
    
5.  **Система рейтингов и отзывов**: Пользователи могут оставлять свои мнения о прочитанных книгах и оценивать их по десятибалльной шкале. Это помогает другим пользователям принимать обоснованные решения при выборе книг.

### Технологии:
- Python
- Django
- Django REST
- Postgres
- React
- Docker (compose)
- Github CI/CD
- Swagger

### API
Документация API находится по ссылке  https://lukabookstore.hopto.org/api/redoc/

### Локальный запуск проекта
Клонировать репозиторий, перейти в директорию backend:

```
git clone https://github.com/lukawoy/bookstore.git
```

```
cd backend/
```

Cоздать и активировать виртуальное окружение:

```
python3 -m venv env
```

* Если у вас Linux/macOS

    ```
    source env/bin/activate
    ```

* Если у вас Windows

    ```
    source env/scripts/activate
    ```

```
python3 -m pip install --upgrade pip
```

Установить зависимости из файла requirements.txt:

```
pip install -r requirements.txt
```

Заменить словарь DATABASES в файле settings.py на:

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

Заменить список ALLOWED_HOSTS в файле settings.py на:

```
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
```

Добавить в список INSTALLED_APPS приложение "corsheaders" в файле settings.py:

```
INSTALLED_APPS = [
    ...
    "corsheaders",
]
```

Добавить в список MIDDLEWARE строку "corsheaders.middleware.CorsMiddleware" в файле settings.py:

```

MIDDLEWARE = [
    ...
    "corsheaders.middleware.CorsMiddleware",
]
```
Добавить в файл settings.py константу:

```
CORS_ORIGIN_ALLOW_ALL = True
```
Выполнить миграции:

```
python3 manage.py migrate
```

Запустить бэкенд:

```
python3 manage.py runserver
```

Перейти в директорию frontend:

```
cd ../frontend/
```

Установить зависимости и запустить фронт:
```
npm install
npm start
```

Для загрузки начальных данных можно выполнить команду:
```
python manage.py import_data_json
```
при этом в БД загрузятся данные из файлов Author.json и Books.json, находящихся в директории /backend/inital_data/


Разработчик - Лукин Дмитрий.
