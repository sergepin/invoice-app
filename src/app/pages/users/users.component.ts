import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { appSettings } from '../../settings/app.settings';

interface UserPurchase {
  userId: string;
  name: string;
  email: string;
  totalPurchases: number;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: UserPurchase[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsersWithPurchases();
  }

  getUsersWithPurchases(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      console.error('No access token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const apiUrl = `${appSettings.apiUrl}/orders/all-users-purchases-last-month`;

    this.http.get<{ purchases: UserPurchase[] }>(apiUrl, { headers })
      .subscribe({
        next: (response) => {
          console.log('API Response:', response);
          this.users = response.purchases;
        },
        error: (error) => {
          console.error('Error fetching users', error);
        }
      });
  }
}
