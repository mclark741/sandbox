import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  serverName: string = "Test Server";
  serverCreated: boolean = false;
  servers: string[] = ["TestServer", "TestServer 2"];
  display: boolean = false;
  displayClicks: number[] = [];

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000)
  }

  ngOnInit() {}
  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.serverName);
  }

  onUpdateServerName(e: Event) {
    this.serverName = ( < HTMLInputElement > e.target).value;
  }
  onDisplayDetails() {
    this.display = !this.display;
    this.displayClicks.push(this.displayClicks.length + 1);
  }
}
