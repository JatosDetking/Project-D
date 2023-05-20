import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Terrain } from 'src/app/interfaces/terrain';
import { User } from 'src/app/interfaces/user';
import { MatAccordion } from '@angular/material/expansion';
import { Comment } from 'src/app/interfaces/comment';
import { FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';


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
  content = new FormControl('', [Validators.required]);

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
    private sharedService: SharedService,
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.terrain = JSON.parse(this.route.snapshot.queryParams['terrain']);
    this.creator = this.sharedService.UserService?.getUser(this.terrain.creator_id)!;
    this.editor = this.sharedService.UserService?.getUser(this.terrain.last_change_id)!;
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
    this.refreshTerrain()
  }
  fillList() {
    let newComments: Comment[] = [];
    this.sharedService.CommentService?.getComments(this.terrain.id).subscribe((res: any) => {
      for (const key in res) {
        const CommentData = res[key];

        CommentData.edit_date = this.sharedService.SharedLogicService?.formatDateTime(CommentData.edit_date);

        for (const key2 in CommentData.subComment) {
          CommentData.subComment[key2].edit_date = this.sharedService.SharedLogicService?.formatDateTime(CommentData.subComment[key2].edit_date);
        }
        newComments.push(CommentData);
      }
      this.comments = newComments;
    });

  }
  myCallbackFunctionFillList = (): void => {
    this.fillList();
  }
  getVotes() {
    this.sharedService.VotesService?.getVotes(this.terrain.id).subscribe((res: any) => {
      this.votes = { upvote: res.upvote, downvote: res.downvote };
    });
  }
  getMyVote() {
    this.sharedService.VotesService?.getMyVotes(this.terrain.id).subscribe((res: any) => {
      if (res.type != -1) {
        this.myVoteType = res.type;
        this.myVote = res;
      }
    });
  }

  setMyVote() {
    this.sharedService.VotesService?.setMyVote(this.terrain.id, this.myVoteType).subscribe((res: any) => {

      this.getVotes();
    });
  }

  setMyComment() {
    this.sharedService.CommentService?.setComments(this.terrain.id, this.content.value).subscribe((res: any) => {
      this.content.setValue("");
      this.content.markAsPristine();
      this.content.markAsUntouched();
      this.fillList();
    });
  }

  refreshTerrain() {
    this.sharedService.TerrainService?.getTerrain(this.terrain.id).subscribe((res: any) => {
      res.last_change_time = this.sharedService.SharedLogicService?.formatDateTime(res.last_change_time);
      this.terrain = res;
    });
  }
  saveTerrain() {
    this.sharedService.CommentService?.setComments(this.terrain.id, this.content.value).subscribe((res: any) => {
      this.content.setValue("");
      this.content.markAsPristine();
      this.content.markAsUntouched();
      this.fillList();
    });
  }
}
