### `README.md`

```markdown
# Travel Planner

Travel Planner — это веб-приложение для создания, редактирования и просмотра планов путешествий. Пользователи могут выбирать страну из списка, добавлять места для посещения и управлять своими планами с помощью удобного интерфейса.

## Основные возможности
- **Создание плана**: Укажите название, выберите страну из списка с поиском и добавьте места для посещения.
- **Редактирование плана**: Изменяйте существующие планы, добавляйте или удаляйте места.
- **Просмотр планов**: Список планов с фотографиями стран (через Unsplash API) и детальная информация о каждом плане.
- **Интеграция с Firebase**: Все данные хранятся в Firebase Realtime Database.
- **Адаптивный дизайн**: Интерфейс построен с использованием Material-UI.

## Технологии
- **React**: Библиотека для построения пользовательского интерфейса.
- **TypeScript**: Статическая типизация для надежности кода.
- **Material-UI**: Компоненты для современного и адаптивного дизайна.
- **Firebase Realtime Database**: Хранение данных о планах путешествий.
- **Unsplash API**: Получение фотографий стран для визуализации.
- **Axios**: HTTP-запросы к внешним API.

## Структура проекта
```
src/
├── components/           # Переиспользуемые компоненты
│   └── TravelPlanCard.tsx # Карточка плана путешествия
├── firebase/            # Конфигурация Firebase
│   └── config.ts
├── pages/               # Страницы приложения
│   ├── CountriesListPage.tsx    # Главная страница со списком планов
│   ├── CountryDetailPage.tsx    # Страница деталей страны и плана
│   ├── CreateTravelPlanPage.tsx # Страница создания плана
│   └── EditTravelPlanPage.tsx   # Страница редактирования плана
├── services/            # Сервисы для работы с API
│   └── countriesService.ts
├── types/               # Типы TypeScript
│   └── index.ts
└── README.md            # Документация проекта
```

## Установка
1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/your-username/travel-planner.git
   cd travel-planner
   ```

2. **Установите зависимости**:
   ```bash
   npm install
   ```

3. **Настройте Firebase**:
   - Создайте проект в [Firebase Console](https://console.firebase.google.com/).
   - Включите Realtime Database.
   - Скопируйте конфигурацию Firebase (API Key, Database URL и т.д.) и вставьте её в `src/firebase/config.ts`. Пример:
     ```typescript
     // src/firebase/config.ts
     import { initializeApp } from 'firebase/app';
     import { getDatabase } from 'firebase/database';

     const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-sender-id",
       appId: "your-app-id"
     };

     const app = initializeApp(firebaseConfig);
     export const db = getDatabase(app);
     ```

4. **Настройте Unsplash API**:
   - Зарегистрируйтесь на [Unsplash Developers](https://unsplash.com/developers).
   - Создайте приложение и получите **Access Key**.
   - Вставьте ключ в `src/pages/CountriesListPage.tsx`:
     ```typescript
     const UNSPLASH_API_KEY = 'your-unsplash-access-key';
     ```

## Запуск проекта
1. **Запустите приложение в режиме разработки**:
   ```bash
   npm start
   ```
   Приложение откроется в браузере по адресу `http://localhost:3000`.

2. **Сборка для продакшена** (опционально):
   ```bash
   npm run build
   ```

## Использование
1. **Главная страница (`/`)**:
   - Просмотрите список существующих планов путешествий.
   - Нажмите "Добавить план" для создания нового.

2. **Создание плана (`/create`)**:
   - Введите название плана.
   - Выберите страну из списка (с поиском).
   - Добавьте места для посещения с помощью кнопки "+".
   - Нажмите "Сохранить".

3. **Редактирование плана (`/edit/:id`)**:
   - Измените название, страну или места.
   - Добавляйте или удаляйте места с помощью "+" и "−".
   - Сохраните изменения.

4. **Детали плана (`/country/:code`)**:
   - Просмотрите информацию о стране и плане.
   - Отредактируйте или удалите план.

## Примечания
- **Лимиты Unsplash API**: Бесплатный ключ ограничен 50 запросами в час. Для большего объёма используйте кэширование или платный план.
- **Типизация**: Весь код строго типизирован с использованием TypeScript, что исключает использование `any`.
