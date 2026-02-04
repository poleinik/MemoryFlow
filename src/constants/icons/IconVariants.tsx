import CodeIcon from 'assets/CodeIcon';
import LanguagesIcon from 'assets/LanguagesIcon';
import OpenBookIcon from 'assets/OpenBookIcon';
import CalculatorIcon from 'assets/CalculatorIcon';
import FlaskConicalIcon from 'assets/FlaskConicalIcon';
import MusicIcon from 'assets/MusicIcon';

export const IconVariants = [
    {name: 'CodeIcon.tsx', component: (color: string) => <CodeIcon color={color} />},
    {name: 'OpenBookIcon.tsx', component: (color: string) => <OpenBookIcon color={color} />},
    {name: 'LanguagesIcon.tsx', component: (color: string) => <LanguagesIcon color={color} />},
    {name: 'CalculatorIcon.tsx', component: (color: string) => <CalculatorIcon color={color} />},
    {name: 'FlaskConicalIcon.tsx', component: (color: string) => <FlaskConicalIcon color={color} />},
    {name: 'MusicIcon.tsx', component: (color: string) => <MusicIcon color={color} />},

];