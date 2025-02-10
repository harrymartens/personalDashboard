export interface Habit {
    name: string;
    current_progress: number;
    target: number;
    colour:string;
    icon:React.FC<React.SVGProps<SVGSVGElement>>;
    week:Date;
}