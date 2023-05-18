import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Terrain } from 'src/app/interfaces/terrain';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { MatAccordion } from '@angular/material/expansion';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment';



@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss']
})
export class TerrainComponent implements OnInit {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  isEditable = true;
  myId: number = +(localStorage.getItem("id") || 0);

  comments: Comment[] =[];

  terrain: Terrain = {
    id: 0,
    name: "Empty",
    price: 0,
    creator_id: 0,
    type: "Empty",
    last_change_time: "Empty",
    last_change_id: 0,
  };
  creator: User = {
    id: 0,
    username: "creator",
    email: "creator",
    name: "creator"
  };
  editor: User = {
    id: 0,
    username: "editor",
    email: "editor",
    name: "editor"
  };


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.terrain = JSON.parse(this.route.snapshot.queryParams['terrain']);
    //console.log(this.terrain.id)
    this.creator = this.getUser(this.terrain.creator_id);
    this.editor = this.getUser(this.terrain.last_change_id);
    this.fillList(this.terrain.id);
  }

  getUser(id: number) {
    const user: User = {
      id: 0,
      username: "",
      email: "",
      name: ""
    };
    this.userService.getUserInfo(id).subscribe((res: any) => {
      user.id = id;
      user.username = res.username;
      user.email = res.email;
      user.name = res.name;
    });
    return user;
  }

  hideComponent() {
    if (this.terrain.type == "editable" || this.terrain.creator_id == this.myId) {
      this.isEditable = true;
    }
    else {
      this.isEditable = false;
    }

  }
  fillList(id: number) {
    this.commentService.getComments(id).subscribe((res: any) => {
      for (const key in res) {
        const CommentData = res[key];

        console.log(CommentData);
        this.comments.push(CommentData);   
      }
    });
  }
}
