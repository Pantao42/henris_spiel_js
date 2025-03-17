class HenrisSpiel {
    constructor() {
        this.storyText = document.getElementById('story-text');
        this.buttonsContainer = document.getElementById('buttons-container');
        this.restartButton = document.getElementById('restart-button');
        this.eyeContainer = document.getElementById('eye-container');
        this.leftEye = document.getElementById('left-eye');
        this.rightEye = document.getElementById('right-eye');
        this.currentScene = null;
        this.lastQuestion = '';
        
        this.restartButton.addEventListener('click', () => this.startGame());
        
        // Füge Event-Listener für die Augen hinzu
        this.leftEye.addEventListener('click', () => this.handleInput('links'));
        this.rightEye.addEventListener('click', () => this.handleInput('rechts'));
        
        this.startGame();
    }

    createAnswerButtons(options) {
        this.buttonsContainer.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('answer-button');
            button.addEventListener('click', () => this.handleInput(option));
            this.buttonsContainer.appendChild(button);
        });
    }

    async displayText(text) {
        // Wenn der Text mit einem Fragezeichen endet, ist es eine Frage
        if (text.includes('?')) {
            this.lastQuestion = text;
            this.storyText.innerHTML = `<p>${text}</p>`;
            
            // Extrahiere die Optionen aus der Frage
            const optionsMatch = text.match(/\((.*?)\)/);
            if (optionsMatch) {
                const options = optionsMatch[1].split('/').map(opt => opt.trim());
                this.createAnswerButtons(options);
            }
        } else {
            // Wenn es eine Antwort ist, zeige die letzte Frage und die Antwort
            this.storyText.innerHTML = `<p>${this.lastQuestion}</p><br><p>→ ${text}</p>`;
            this.buttonsContainer.innerHTML = '';
        }
        this.storyText.scrollTop = this.storyText.scrollHeight;
    }

    clearDisplay() {
        this.storyText.innerHTML = '';
        this.buttonsContainer.innerHTML = '';
        this.restartButton.style.display = 'none';
        this.eyeContainer.style.display = 'none';
        this.leftEye.style.display = 'none';
        this.rightEye.style.display = 'none';
    }

    endGame() {
        this.buttonsContainer.innerHTML = '';
        this.restartButton.style.display = 'inline';
    }

    generateRandomChoice() {
        return Math.floor(Math.random() * 2) + 1;
    }

    async handleGraziusEncounter() {
        this.eyeContainer.style.display = 'flex';
        this.leftEye.style.display = 'block';
        this.rightEye.style.display = 'block';
        this.buttonsContainer.style.display = 'none';
        await this.displayText("Hinter der Tür wartet Herr Grazius und starrt dich an. In welches Auge schaust du? Klicke auf ein Auge.");
        this.currentScene = 'grazius';
    }

    async handleNiedorfTest() {
        await this.displayText("Hinter der Tür steht Herr Niedorf und macht einen Überraschungstest.");
        this.fragen = [
            ["Ist E.Coli Grammnegativ oder Grammpositiv? (negativ/positiv)", "negativ"],
            ["Kann E.Coli Sporen bilden? (ja/nein)", "nein"],
            ["Sind Plasmide Einsträngig oder Doppelsträngig? (a/b)", "b"]
        ];
        this.currentFrage = 0;
        await this.displayText(this.fragen[0][0]);
        this.currentScene = 'niedorf';
    }

    async handleBasement() {
        await this.displayText("Hinter der Tür befindet sich ein Flur mit zwei Türen auf welchen A und B steht. Welche wählst du? (a/b)");
        this.currentScene = 'basement';
    }

    async handleTuerwahl() {
        await this.displayText("Du drehst dich um und siehst 5 Türen vor dir. Welche Tür wählst du? (1/2/3/4/5)");
        this.currentScene = 'tuerwahl';
    }

    async startGame() {
        this.clearDisplay();
        await this.displayText("Es ist Montag morgen. Du stehst vor der Schule. Möchtest du hineingehen? (ja/nein)");
        this.currentScene = 'start';
    }

    async handleInput(input) {
        switch(this.currentScene) {
            case 'start':
                if (input === 'ja') {
                    this.imageContainer.innerHTML = '<img src="assets/treppenhaus.jpg" alt="Treppenhaus" style="max-width: 100%;">';
                    await this.displayText("Du betrittst die Schule und stehst vor einem Treppenhaus. Gehst du hoch oder runter? (hoch/runter)");
                    this.currentScene = 'treppe';
                } else if (input === 'nein') {
                    await this.handleTuerwahl();
                }
                break;

            case 'treppe':
                if (input === 'hoch') {
                    await this.displayText("Oben stehst du vor zwei Türen mit der Nummer 1 und 2. Durch welche gehst du? (1/2)");
                    this.currentScene = 'tuer';
                } else if (input === 'runter') {
                    await this.handleBasement();
                }
                break;

            case 'tuer':
                if (input === '1') {
                    await this.handleGraziusEncounter();
                } else if (input === '2') {
                    await this.handleNiedorfTest();
                }
                break;

            case 'grazius':
                this.eyeContainer.style.display = 'none';
                this.leftEye.style.display = 'none';
                this.rightEye.style.display = 'none';
                this.buttonsContainer.style.display = 'flex';
                if (input === 'rechts') {
                    await this.displayText("Du hast in sein starkes Auge geschaut und bekommst eine 1 Mündlich und keine Hausaufgaben");
                    this.endGame();
                } else if (input === 'links') {
                    await this.displayText("Du schaust in sein schwaches Auge und Grazius nimmt dich nicht wahr. Bleibst du still oder probierst du zu fliehen? (still/flucht)");
                    this.currentScene = 'grazius_flucht';
                }
                break;

            case 'grazius_flucht':
                if (input === 'still') {
                    await this.displayText("Grazius nimmt dich nicht wahr und geht nach kurzer Zeit in einen anderen Raum. Du konntest fliehen aber wurdest als abwesend für seine Stunde eingetragen");
                    this.endGame();
                } else if (input === 'flucht') {
                    if (this.generateRandomChoice() === 1) {
                        await this.displayText("Du wurdest nicht bemerkt und konntest fliehen doch du wurdest für den Rest des Tages als fehlend eingetragen.");
                    } else {
                        await this.displayText("Du wurdest von Grazius entdeckt und bekommst eine 6 Mündlich und Hausaufgaben. Game over");
                    }
                    this.endGame();
                }
                break;

            case 'niedorf':
                if (input === this.fragen[this.currentFrage][1]) {
                    await this.displayText("Richtig!");
                    this.currentFrage++;
                    if (this.currentFrage < this.fragen.length) {
                        await this.displayText(this.fragen[this.currentFrage][0]);
                    } else {
                        await this.displayText("Du bekommst eine 1 und einen Ausbildungsplatz an dem Ort deiner Wahl.");
                        await this.displayText("Du hast gewonnen!");
                        this.endGame();
                    }
                } else {
                    await this.displayText("Falsch! Game Over!");
                    this.endGame();
                }
                break;

            case 'basement':
                if (input === 'a') {
                    await this.displayText("Hinter der Tür steht Herr Jerx und fragt ob Nico schon wieder fehlt.");
                    if (this.generateRandomChoice() === 1) {
                        await this.displayText("Nico ist heute krank.");
                        await this.displayText("Herr Jerx regt sich wieder über Fehlzeiten auf und gibt Nico eine 6. Zusätzlich erzählt er für den Rest des Tages so lange Geschichten, dass du dich zu Tode langweilst. Game over!");
                    } else {
                        await this.displayText("Nico ist heute da");
                        await this.displayText("Herr Jerx ist gut gelaunt und telefoniert für den Rest des Tages");
                    }
                    this.endGame();
                } else if (input === 'b') {
                    await this.displayText("Hinter der Tür steht Frau Vollmer mit Kaffee und Kuchen. Du hast gewonnen :D");
                    this.endGame();
                }
                break;

            case 'tuerwahl':
                const tuerTexte = {
                    '1': "Hinter der Tür ist ein Portal nach Hause. Da du dich nicht bei Niedorf abgemeldet hast bekommst du einen unentschuldigten Fehltag. Ende",
                    '2': "Hinter der Tür wartet der Hausmeister und schickt dich zurück in den Unterricht. Ende",
                    '3': "Die Tür führt in den Schulhof. Du machst blau und bekommst einen Fehltag. Ende",
                    '4': "Hinter der Tür ist der Schulleiter. Er ruft deine Eltern an. Ende",
                    '5': "Die Tür führt in die Cafeteria. Du bleibst den Rest des Tages dort. Ende"
                };
                await this.displayText(tuerTexte[input] || "Diese Tür gibt es nicht. Du gehst verwirrt nach Hause. Ende");
                this.endGame();
                break;
        }
    }
}

// Spiel starten
new HenrisSpiel(); 