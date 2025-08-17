export type AssignmentStatus = 'Active' | 'Stopped' | 'Unknown';
export type Category = 'Bugg' | 'Utveckling' | 'Konfiguration';

export type AssignmentSession = {
    Start: string;
    End?: string | null;
    BillableTime?: number | null;
};

export type AssignmentType = {
    Id: number;
    UserId: string;
    Costumer: string;
    TicketName: string;
    Status: AssignmentStatus;
    CreatedDate: string;
    Description: string;
    ActualTime: number;
    Sessions: AssignmentSession[];
    Category: Category;
    Completed?: boolean;
};

export type UserType = {
    Id: number;
    Name: string;
    Email: string;
    Password: string;
    Role: string;
    CreatedAt: Date;
};
