import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { ProjectsModule } from './projects/projects.module';
import { PostsModule } from './posts/posts.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { ContactsModule } from './contacts/contacts.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';
import { DonationsModule } from './donations/donations.module';
import { EventsModule } from './events/events.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [AuthModule, SettingsModule, CategoriesModule, ProjectsModule, PostsModule, VolunteersModule, ContactsModule, UploadModule, UsersModule, DonationsModule, EventsModule, BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),],
})
export class AppModule { }
