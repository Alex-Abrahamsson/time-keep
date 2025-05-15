

export type AssignmentSession = {
    Start: Date;
    End?: Date | null;
  };
  
  export type AssignmentType = {
    Id: number;
    UserId: string;
    Costumer: string;
    TicketName: string;
    Status: string;
    Date: string;
    Description: string;
    Time: string;
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
}
