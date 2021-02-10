// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const minweightInput = document.querySelector('.minweight__input');
const maxweightInput = document.querySelector('.maxweight__input');
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13, "class": "fruit_violet"},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35, "class": "fruit_green"},
  {"kind": "Личи", "color": "розово-красный", "weight": 17, "class": "fruit_carmazin"},
  {"kind": "Карамбола", "color": "желтый", "weight": 28, "class": "fruit_yellow"},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22, "class": "fruit_lightbrown"}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);
let colors = new Map([
  ["фиолетовый", "fruit_violet"],
  ["зеленый", "fruit_green"],
  ["розово-красный", "fruit_carmazin"],
  ["желтый", "fruit_yellow"],
  ["светло-коричневый", "fruit_lightbrown"]
  ]);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = "";

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
    let li = document.createElement("li");
    li.className = `fruit__item ${fruits[i].class}`;

    let div = document.createElement("div");
    div.className = "fruit__info";

    let index = document.createElement("div");
    let kind = document.createElement("div");
    let color = document.createElement("div");
    let weight = document.createElement("div");

    index.textContent = "номер: " + i;
    kind.textContent = "вид: " + fruits[i].kind;
    color.textContent = "цвет: " + fruits[i].color;
    weight.textContent = "вес (кг): " + fruits[i].weight;

    div.append(index);
    div.append(kind);
    div.append(color);
    div.append(weight);

    li.append(div);

    fruitsList.append(li);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];
  i = 0;
  // копируем в temp объект, а не только ссылку
  let temp =  JSON.parse(JSON.stringify(fruits));

  while (temp.length > 0) {
    random = getRandomInt(0, temp.length - 1);
    result.push(temp.splice(random, 1)[0]);
  }
  if (fruits == result) {
    alert("Ничего не поменялось");
  } else {
    fruits = result;
  };
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    return (item.weight >= minweightInput.value) && (item.weight <= maxweightInput.value);
  });
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ["розово-красный", "желтый", "зеленый", "светло-коричневый", "фиолетовый"];
  console.log(a, b);
  const priority1 = priority.indexOf(a.color);
  const priority2 = priority.indexOf(b.color);
  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
         if (comparation(arr[j], arr[j+1])) {
           let temp = arr[j+1]; 
           arr[j+1] = arr[j]; 
           arr[j] = temp; 
         }
      }
    }
  },

  quickSort(arr, comparation) {

    function swap(arr, firstIndex, secondIndex){
      const temp = arr[firstIndex];
      arr[firstIndex] = arr[secondIndex];
      arr[secondIndex] = temp;
    }

    function partition(arr, left, right) {
     var pivot = arr[Math.floor((right + left) / 2)],
         i = left,
         j = right;
     while (i <= j) {
         while (comparationColor(pivot, arr[i])) {
             i++;
         }
         while (comparationColor(arr[j], pivot)) {
             j--;
         }
         if (i <= j) {
             swap(arr, i, j);
             i++;
             j--;
         }
     }
     return i;
    }
    function quickSort(items, left, right) {
      let index;
      if (arr.length > 1) {
          left = typeof left != "number" ? 0 : left;
          right = typeof right != "number" ? arr.length - 1 : right;
          index = partition(arr, left, right);
          if (left < index - 1) {
              quickSort(arr, left, index - 1);
          }
          if (index < right) {
              quickSort(arr, index, right);
          }
      }
      return arr;
    }
    quickSort();
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind == "bubbleSort") {
    sortKind = "quickSort"
  } else {
    sortKind = "bubbleSort"
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = "sorting...";
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  sortTimeLabel.textContent = sortTime;
  display();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {

  if (kindInput.value == '' || colorInput.value == '' || weightInput.value == '') {
    alert('Заполнены не все поля!')
  } else {
    let newFruit = {"kind": kindInput.value,
                    "color": colorInput.value,
                    "weight": weightInput.value,
                    "class": colors.get(colorInput.value)
                  };
    fruits.push(newFruit);
  }
  display();
});
