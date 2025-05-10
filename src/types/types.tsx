

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
  };

export type UserType = {
    Id: string;
    Name: string;
    Email: string;
    Password: string;
    Role: string;
    CreatedAt: Date;
}
