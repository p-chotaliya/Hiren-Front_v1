import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, CanActivate } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminAdduserComponent } from './admin-adduser/admin-adduser.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserLoginComponent } from './user-login/user-login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
// services
import { AdminAuthService } from './admin-auth.service';
import { UserAuthService } from './user-auth.service';
import { AdminRedirectionService } from './admin-redirection.service';
import { UserRedirectionService } from './user-redirection.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChangeUserPassComponent } from './change-user-pass/change-user-pass.component';
import { SheetComponent } from './sheet/sheet.component';
import { SheetInDetailComponent } from './sheet-in-detail/sheet-in-detail.component';
import { RemarkFilterPipe } from './remark-filter.pipe';
import { ImageSaverComponent } from './image-saver/image-saver.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FolderDetailsComponent } from './folder-details/folder-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddFolderComponent } from './add-folder/add-folder.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DeleteFolderComponent } from './delete-folder/delete-folder.component';
import { MatListModule } from '@angular/material/list';
import { CampaignTruncatePipe } from './campaign-truncate.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { SheetdataDetailsDialogComponent } from './sheetdata-details-dialog/sheetdata-details-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { SumPipe } from './sum.pipe';
import { NewsheetComponent } from './newsheet/newsheet.component';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminAdduserComponent,
    UserLoginComponent,
    FileUploadComponent,
    ChangeUserPassComponent,
    SheetComponent,
    SheetInDetailComponent,
    RemarkFilterPipe,
    ImageSaverComponent,
    PageNotFoundComponent,
    FolderDetailsComponent,
    AddFolderComponent,
    DeleteFolderComponent,
    CampaignTruncatePipe,
    SheetdataDetailsDialogComponent,
    SumPipe,
    NewsheetComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'admin/login',
        component: AdminLoginComponent,
        canActivate: [AdminRedirectionService],
      },
      {
        path: 'admin/adduser',
        component: AdminAdduserComponent,
        canActivate: [AdminAuthService],
      },
      {
        path: 'login',
        component: UserLoginComponent,
        canActivate: [UserRedirectionService],
      },
      {
        path: 'upload',
        component: FileUploadComponent,
        canActivate: [UserAuthService],
      },
      {
        path: 'changePassword',
        component: ChangeUserPassComponent,
        canActivate: [UserAuthService],
      },
      {
        path: 'sheet',
        component: SheetComponent,
        canActivate: [UserAuthService],
      },
      {
        path: 'newsheet',
        component: NewsheetComponent,
        canActivate: [UserAuthService],
      },
      {
        path: 'sheetdetail',
        component: SheetInDetailComponent,
        canActivate: [UserAuthService],
      },
      {
        path: 'imagesaver',
        component: ImageSaverComponent,
        canActivate: [UserAuthService],
        children: [
          { path: 'folder/:foldername', component: FolderDetailsComponent },
          { path: 'addfolder', component: AddFolderComponent },
        ],
      },
      { path: '**', component: PageNotFoundComponent },
    ]),
    ReactiveFormsModule,
    ClipboardModule,
    Ng2SearchPipeModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressBarModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
