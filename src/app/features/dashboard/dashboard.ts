import { ChangeDetectionStrategy, Component } from '@angular/core';

interface DashboardStat {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  readonly stats: readonly DashboardStat[] = [
    {
      label: 'Total Users',
      value: '1,248',
      description: '+12% from last month',
      icon: 'users'
    },
    {
      label: 'Active Sessions',
      value: '326',
      description: 'Currently active',
      icon: 'activity'
    },
    {
      label: 'Projects',
      value: '24',
      description: '8 active projects',
      icon: 'folder'
    },
    {
      label: 'System Status',
      value: 'Healthy',
      description: 'All services operational',
      icon: 'status'
    }
  ];
}