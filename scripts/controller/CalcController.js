class CalcController {
  constructor() {
    //_ -> signfica privado
    this._audio = new Audio("click.mp3"); //api de audio
    this._audioOnOff = false;
    this._lastOperator = "";
    this._lastNumber = "";

    this._operation = []; //a ideia de guadar a nossa operação
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateCalcEl = document.querySelector("#data");
    this._timeCalcEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonEvents();
    this.initKeyboard();
  }
  /*
   *Metodo de setar a data ao iniciar a calculadora
   */
  initialize() {
    this.setDisplayDateTime();

    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);

    this.setLastNumberToDisplay();
    this.pasteFromClipboard(); //tem que iniciar o evento logo ao inicializar a calculadora

    document.querySelectorAll(".btn-ac").forEach((btn) => {
      btn.addEventListener("dblclick", (e) => {
        this.toggleAudio();
      });
    });
  }

  toggleAudio() {
    //ele existe?           //se nao
    this._audioOnOff = this._audioOnOff ? false : true;

    //if(this._audioOnOff){
    //    this._audioOnOff = false;
    //} else {
    //    this._audioOnOff = true;
    //}
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0; //o tempo que o audio ta no momento, volta pro inicio
      this._audio.play();
    }
  }

  copyToClipboard() {
    let input = document.createElement("input");
    input.value = this.displayCalc;

    document.body.appendChild(input); //agora o input esta na tela, o body abraçou o input com o appendChild

    input.select(); //conteudo selecionado

    document.execCommand("Copy"); //agora a gente pega a informação e copia pro sistema operacional

    input.remove(); //
  }

  pasteFromClipboard() {
    document.addEventListener("paste", (e) => {
      //evento paste, e o 'e' que vai controlar o que vamos acessar

      let text = e.clipboardData.getData("Text"); //propriedade clipboardData, dentro dela um metodo getData que recebe text,
      //o tipo de informação, que é um texto não imagem etc...

      this.displayCalc = parseFloat(text); //pra ele nao colocar texto e sim só numero
    });
  }

  initKeyboard() {
    document.addEventListener("keyup", (e) => {
      this._audio;
      switch (
        e.key //e é o evento e key é a propridade que retorna o valor
      ) {
        case "Escape":
          this.clearAll();
          break;

        case "Backspace":
          this.clearEntry();
          break;

        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          this.addOperation(e.key);
          break;

        case "Enter":
        case "=":
          this.calc();
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(parseInt(e.key)); //transforma pra numero
          break;

        case ".":
        case ",":
          this.addDot();
          break;

        case "c": //caso tenha apertado a tecla c
          if (e.ctrlKey) this.copyToClipboard(); // ai tu ve se o Ctrl foi segurado quando ele apertou 'C', e se apertou copia
          break;
      }
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  /*
   *Metodo de limpar tudo o que esta no display ai apertar a tecla
   */
  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperator = "";
    this.setLastNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1]; //vai ver o tamanho do array (itens) e vai retornar o ultimo que tem
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    //o indexOf vai ver se existe dentro desse array o valor, se ele achar ele mostra o index, se ele ano achar mostra -1
    if (["+", "-", "%", "*", "/"].indexOf(value) > -1) {
      return true; //se for maior ele fala que sim, é um operador
    } else {
      return false;
    }
  }

  pushOperation(value) {
    this._operation.push(value); //push adiciona no final do array um valor

    if (this._operation.length > 3) {
      //mais que 3 elementos

      this.calc();

      console.log(this._operation);
    }
  }

  getResult() {
    try { //try "eu vou tentar fazer esse codigo acontecer"
      return eval(this._operation.join("")); //join que ele vai juntar, eval vai somar
    } catch { //se eu nao conseguir...

      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let last = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber]; //zerar a operacao
    }

    if (this._operation.length > 3) {
      last = this._operation.pop(); //tira o meu ultimo elemtno guarda na variavel last
      this._lastNumber = this.getResult(); //guardar qual vai ser o resultado o numero, quando for mais de 3 itens
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = eval(this.getResult());

    if (last == "%") {
      result = result / 100;
      this._operation = [result];
    } else {
      this._operation = [result];

      if (last) this._operation.push(last); //só adiona ele se realemente existir
    }

    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    //por padrao sempre traz o ultimo operador
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      //condicao //entao              //se nao
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false); //vai pegar o o utlimo se for false que no caso vai ser numero nao operador

    if (!lastNumber) lastNumber = 0; //se o nao existe é 0
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    //valor atual

    //se não é um numero ele vem nesse if
    if (isNaN(this.getLastOperation())) {
      // se o ultimo valor não é um numero, não o valor atual o ultimo antes desse

      //é um operador?
      if (this.isOperator(value)) {
        //se ele for um operador
        //trocar o operador
        this.setLastOperation(value); //o ultimo item vai ser igual o meu operador do momento

        //isso nao é um numero?
      } else {
        // é um numero, entao adiciona
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
      //se ele for numero ele vem pra ca
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString(); //em vez de somar ele contatena
        this.setLastOperation(newValue);
        this.setLastNumberToDisplay();
      }
    }
  }

  setError() {
    this.displayCalc = "Error";
  }

  addDot() {
    let lastOperation = this.getLastOperation();

    //essa var ta vindo um texto nela    e  dentro desse texto tem um ponto?
    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > 1
    )
      return;
    //ou ele nao existir
    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
      this.setLastNumberToDisplay();
    }
  }

  execBtn(value) {
    //recebe um parametro que aqui a gente da o nome de valor, mas o valor é o textBtn
    this.playAudio();

    switch (value) {
      case "ac":
        this.clearAll();
        break;

      case "ce":
        this.clearEntry();
        break;

      case "soma":
        this.addOperation("+");
        break;

      case "subtracao":
        this.addOperation("-");
        break;

      case "divisao":
        this.addOperation("/");
        break;

      case "multiplacao":
        this.addOperation("*");
        break;

      case "porcento":
        this.addOperation("%");
        break;

      case "igual":
        this.calc();
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(parseInt(value)); //transforma pra numero
        break;

      case "ponto":
        this.addDot();
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonEvents() {
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag", (e) => {
        let textBtn = btn.className.baseVal.replace("btn-", "");

        this.execBtn(textBtn); //ele passa com parametro o valor do textBtn
      });

      this.addEventListenerAll(btn, "mouseup mouseover mousedown ", (e) => {
        btn.style.cursor = "pointer";
      });
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale);
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  /*
   *GET e SET da hora
   */
  get displayTime() {
    return this._timeCalcEl.innerHTML;
  }

  set displayTime(value) {
    return (this._timeCalcEl.innerHTML = value);
  }

  /*
   *GET e SET da data
   */
  get displayDate() {
    return this._dateCalcEl.innerHTML;
  }

  set displayDate(value) {
    return (this._dateCalcEl.innerHTML = value);
  }

  /*
   *GET e SET da calculadora no display dela (tela)
   */
  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    if (value.toString().length > 10) {
      //toString porque a soma ele acaba sendo uma String
      this.setError();
      return false;
    }

    this._displayCalcEl.innerHTML = value;
  }

  /*
   *GET e SET da criação de uma nova data
   */
  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}