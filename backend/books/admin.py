from django.contrib import admin

from .models import Book, Favourites, ShoppingList, Review, AuthorBook, Author


class AuthorInline(admin.TabularInline):
    model = AuthorBook
    extra = 1


class BookAdmin(admin.ModelAdmin):
    inlines = (AuthorInline,)


admin.site.register(Book, BookAdmin)
admin.site.register(Favourites)
admin.site.register(ShoppingList)
admin.site.register(Review)
admin.site.register(Author)
