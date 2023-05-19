import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Terrain } from 'src/app/interfaces/terrain';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { MatAccordion } from '@angular/material/expansion';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment';
import { FormControl, Validators } from '@angular/forms';
import { SharedLogicService } from 'src/app/services/shared.logic.service';
import { VotesService } from 'src/app/services/votes.service';


@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.component.html',
  styleUrls: ['./terrain.component.scss']
})
export class TerrainComponent implements OnInit {

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  isEditable = true;
  inEdit = false;
  selecteType?: string
  myVoteType = -1;
  myVote: any;
  like = false;
  dislike = false;

  myId: number = +(localStorage.getItem("id") || 0);

  name = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.pattern(/^\d+$/), Validators.required]);

  votes: any;
  comments: Comment[] = [];

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
    private commentService: CommentService,
    private sharedLogicService: SharedLogicService,
    private votesService: VotesService
  ) { }

  ngOnInit(): void {
    this.terrain = JSON.parse(this.route.snapshot.queryParams['terrain']);
    this.creator = this.userService.getUser(this.terrain.creator_id);
    this.editor = this.userService.getUser(this.terrain.last_change_id);
    this.fillList();
    this.name.setValue(this.terrain.name);
    this.price.setValue(this.terrain.price);
    this.selecteType = this.terrain.type;
    this.getVotes();
    this.getMyVote();

  }

  hideComponent() {
    if (this.terrain.type == "editable" || this.terrain.creator_id == this.myId) {
      this.isEditable = true;
    }
    else {
      this.isEditable = false;
    }

  }
  goToEditMode() {
    this.inEdit = true;
  }
  saveChanges() {
    this.inEdit = false;
  }
  fillList() {
    this.commentService.getComments(this.terrain.id).subscribe((res: any) => {
      for (const key in res) {
        const CommentData = res[key];

        CommentData.edit_date = this.sharedLogicService.formatDateTime(CommentData.edit_date);

        for (const key2 in CommentData.subComment) {
          CommentData.subComment[key2].edit_date = this.sharedLogicService.formatDateTime(CommentData.subComment[key2].edit_date);
        }
        this.comments.push(CommentData);
      }
    });
  }
  getVotes() {
    this.votesService.getVotes(this.terrain.id).subscribe((res: any) => {
      this.votes = { upvote: res.upvote, downvote: res.downvote };
    });
  }
  getMyVote() {
    this.votesService.getMyVotes(this.terrain.id).subscribe((res: any) => {
      if (res.type != -1) {
       this.myVoteType = res.type;
       console.log(11111111111111)
        this.myVote = res;
      }
    });
  }

  setMyVote() {
    this.votesService.setMyVote(this.terrain.id, this.myVoteType).subscribe((res: any) => {
      
      this.getVotes();
    });
  }
}
