import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userId: string | null = '';
  userName: string | null = '';
  userPhoto: string | null = '';
  isLoggedIn: boolean = false;

  constructor(private route: Router) {
   
  }
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      this.isLoggedIn = true;
      this.userId = user.id;
      this.userName = user.name; 
      this.userPhoto = `data:image/jpeg;base64,${user.profilePicture}`;
    } else {
      this.isLoggedIn = false;
      this.userId = null;
      this.userName = null;
      this.userPhoto = null;
    }
  }
  logout() {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.userId = null;
    this.userName = null;
    this.userPhoto = null;
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful',
      text: 'You have been logged out successfully.',
    }).then(() => {
      location.reload();
    });
  }
  irASeccion(seccionId: string): void {
    const currentUrl = this.route.url.split('#')[0];

    if (currentUrl.includes('landing')) {
      this.route.navigate([], { fragment: seccionId }).then(() => {
        const el = document.getElementById(seccionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      this.route.navigate(['/home'], { fragment: seccionId });
    }
  }
}

