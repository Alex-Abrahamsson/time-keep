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
    Status: string;
    Date: string;
    Description: string;
    Time: number;
    Sessions: AssignmentSession[];
    Category: string;
};

export type UserType = {
    Id: number;
    Name: string;
    Email: string;
    Password: string;
    Role: string;
    CreatedAt: Date;
};
