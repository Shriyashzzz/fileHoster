# Hwoosting

Hello thank you checking out my app! Hwoosting is an SSR file hosting web app that uses Supabase for file storage.
You can upload files of my any mimeType as long as it's less than 10 MB each upload.

## Stack

- TypeScript
- Express
- Postgres
- Supabase
- Prisma
- Passport
- EJS

**Major Focus:** PostgreSQL database used to store client files metadata, whereas the RAW files or "blob" as you call them is stored in supabase.
Likewise I use supabase's own client similar to prisma to peform CRUD operations on my buckets.

## Features:

- Authentication babyy, uses passport.js for "local" authentication, your passwords are hashed using salt to ensure nobody dares to brute force it, that also means you can access this wannabe google drive from different devices by just logging in.

- You can also either download your files when you need them or generate an signed link(which uses supabase client to do that on the backend), that you can either share with your boys.

- You can also rename your files, how about that.

## Couple of really cool stuff clients are not gonna see

1. Has a transactional logic on the backend whenever any crud operations are done. For example: Since I have two different database i.e PostgreSQL(where I store user info and file's metadata) & Supbase's S3 Bucket where I store the actual raw blob of data, If either of database fail to perform the asked CRUD operation, the whole operation is rolled back, meaning there's no concurrency issues.

2. This was my first project with typescript, although I did use TS to it's absolute max. I belive my work should less prone to failing on production compared to just using plain old js. Most of the variables are type checked, and a lot of bugs were avoided during compile time. Although there seem to be a weird quirk between ESM and typescript, where you need to import modules with ".js" extension, although that only happened to me on production, was working ok locally.

3. Prisma ORM for the win, which means I wont have to write RAW SQL queries anymore hehehehehe, although It's pain in the ass to set it up initially, the migration from my local enviroment to supabase was so easy, also changing schema's no sweat with it. There's also linting when performing your CRUD operations. So all that was lovely.

# Preview

![Alt text](/app_preview/homePage.png "Home Page")
![Alt text](/app_preview/newFolder.png "Add Folder")
![Alt text](/app_preview/fileDetails.png "File Details")
![Alt text](/app_preview/totFile.png "Share File")
![Alt text](/app_preview/shareLink.png "Signed Link")
![Alt text](/app_preview/logIn.png "Authentication")
![Alt text](/app_preview/signUp.png "Create User")

| ENV VARIABLES       |                                    EXPLANATON                                     |
| ------------------- | :-------------------------------------------------------------------------------: |
| NODE_ENV            |                     Your current Running Env. "DEV" OR "PROD"                     |
| DATABASE_URL        | Psql Database URL from your Database Hosting Provider. Local for "DEV" Enviroment |
| SUPABASE_URL        |      Supabase Url used by supabase client to talk to perform CRUD operations      |
| SUPBASE_SERIVCE_KEY |              Service key found undre container's API Key's Settings               |

_Made while learning through the Odin Project. Give it a star if you liked this project. plewaseeee plweaseee give me a star hehe_
