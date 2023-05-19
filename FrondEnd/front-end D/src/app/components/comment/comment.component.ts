import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() data?: Comment;
  @Input() sub: boolean = undefined || false;

  name?: string;
  myId: string = localStorage.getItem('id')!;
  //content?:string;
  //editDate?:string;
  user?: User;
  isHidden = false;

  constructor(
    private userService: UserService
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

}
