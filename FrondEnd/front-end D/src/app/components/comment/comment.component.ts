import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() data?: Comment;
  @Input() terrain_id?: number;
  @Input() sub: boolean = undefined || false;
  @Input() fillList?: () => void;

  content = new FormControl('', [Validators.required]);
  contentFromUpdate = new FormControl('', [Validators.required, Validators.maxLength(250)]);
  name?: string;
  myId: string = localStorage.getItem('id')!;
  //content?:string;
  //editDate?:string;
  user?: User;
  isHidden = false;
  inEdit=false;

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.user = this.userService.getUser(this.data.user_id)
    }
  }

  isMyComment() {
    let result = false;
    if (this.user && this.user.id == +this.myId) {
      result = true;
    }
    return result;
  }

  setMySubComment() {
    if (this.data && this.terrain_id) {
      this.sharedService.CommentService?.setSubComments(this.terrain_id, this.content.value, this.data.id).subscribe((res: any) => {
        this.content.setValue("");
        this.content.markAsPristine();
        this.content.markAsUntouched();
        if (this.fillList) {
          this.fillList();
        }
      });
    }
  }
  deleteMySubComment() {
    if (this.data) {
    
      this.sharedService.CommentService?.deleteComments(this.data.id).subscribe((res: any) => {
        if (this.fillList) {
          this.fillList();
        }
      });
    }
  }
  changeMode(){
    if (this.data) {
      this.contentFromUpdate.setValue(this.data.content);
      this.inEdit= !this.inEdit;
    }
  }
  updateMyComment() {
    if (this.data) {
      this.sharedService.CommentService?.updateComments(this.data.id, this.contentFromUpdate.value).subscribe((res: any) => {
        if (this.fillList) {
          this.fillList();
        }
      });
    }
  }
}
