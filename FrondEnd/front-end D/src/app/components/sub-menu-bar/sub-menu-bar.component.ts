import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupUsersComponent } from 'src/app/dialogs/group-users/group-users.component';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-sub-menu-bar',
  templateUrl: './sub-menu-bar.component.html',
  styleUrls: ['./sub-menu-bar.component.scss']
})
export class SubMenuBarComponent implements AfterViewInit {

  constructor(
    public authService:AuthService,
    public groupService:GroupService,
    public menuService:MenuService,
    public dialog: MatDialog,
  ) { }

  toggle!:()=>void

  ngAfterViewInit(): void {
    this.toggle = this.menuService.toggle;
    
  }

  selectGroupSubmenu(sel:"add" | "calendar" | "list"){
    this.groupService.selectSubmenu(sel) 
  }

  openGroupUserPanel(){
    const dialogRef = this.dialog.open(GroupUsersComponent, {
      panelClass:'group-users-panel',
      maxWidth:window.innerWidth<300?'100%':undefined,
      width: '369px',
      height: window.innerWidth<300?'472':'450px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {
    });
  }

}
