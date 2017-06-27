export class Aiaconfig {
  public id: any;
  public aiaName: any;
  public aiaDottedIp: any;
  public photoUrl: string;
  public firstName: string;
  public lastName: string;
  public fullName: string;
  public displayName: string;
  public bio: string;
  public posXFt: string;
  public macAddress: any;
  constructor(props: any) {
    Object.assign(this, props);
  }
}
