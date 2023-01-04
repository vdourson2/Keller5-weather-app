
//Fonction de calcul des températures min et max d'un tableau.
//Cette fonction prend comme paramètre un tableau de températures,
//et renvoie un tableau contenant 2 données : la première est la t°min, 
//et la deuxième est la t°max.
export function getMinMax(temp){
    let MinMax = [];
    let min = temp[0];
    let max = temp[0];
    for (let t of temp){
        if (t<min) {
            min = t;
        } else if(t>max){
            max = t;
        }
    }
    MinMax.push(min);
    MinMax.push(max);
    return MinMax;
};

//Fonction d'extraction de deux icones de weather en matinée et en fin d'après-midi
//Cette fonction prend comme paramètre un tableau d'icones
//et renvoie un tableau contenant 2 données : l'icone de matinée, et l'icone d'après-midi
export function getTwoIcons(icons){
    let twoIcons = [];
    if (icons.length > 4){
        twoIcons.push(icons[icons.length - 5]);
        twoIcons.push(icons[icons.length - 3]);
    } else if (icons.length == 4){
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length - 3]);
    } else {
        twoIcons.push(icons[0]);
        twoIcons.push(icons[icons.length-1]);
    }
    return twoIcons
};