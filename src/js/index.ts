class AccessibilityEnabler {
    private activeInfoBubble: HTMLElement;
    readonly speechUtterance: SpeechSynthesisUtterance;
    readonly voices: SpeechSynthesisVoice[];

    constructor() {
        this.speechUtterance = new SpeechSynthesisUtterance();

        this.voices = window.speechSynthesis.getVoices();

        console.log('DK this.voices: ', this.voices);
    }

    buildSection()  {
        document.querySelectorAll('.section-container')
            .forEach((section, index) => {
                section.setAttribute('data-section', `section-${index + 1}`);
            });
    };

    attachEvents()  {
        document.addEventListener('keyup', (event) => {
            const focusElement: any = document.activeElement;

            if (event.key === 'Enter') {
                if (document.body.classList.contains('active-tabulation')) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    // console.log(focusElement.dataset['section'] );

                    const currentSectionNumber = parseInt(focusElement.dataset['section'].split('-')[1], 10);

                    const nextSection: HTMLElement = document.querySelector(`[data-section="section-${currentSectionNumber + 1}"]`);

                    if (nextSection) {
                        nextSection.focus();
                    } else {
                        (document.querySelector('[data-section="section-1"]') as HTMLInputElement).focus();
                    }
                }

                if (focusElement.classList.contains('section-container')) {
                    this.hideInfoBubble();

                    const elementMessage = focusElement.getAttribute(focusElement.getAttribute('alt') ||'placeholder') || focusElement.getAttribute('title') || focusElement.textContent;

                    this.showInfoBubble(elementMessage, focusElement.parentElement);
                }
            }
            // if the key is tabulation add class to the body
            if (event.key === 'Tab') {
                this.hideInfoBubble();

                document.body.classList.add('active-tabulation');

                const elementMessage = focusElement.getAttribute('placeholder') || focusElement.getAttribute('alt') || focusElement.getAttribute('title') || focusElement.textContent;

                if (focusElement.classList.contains('section-container')) {
                    this.showInfoBubble(elementMessage, focusElement.parentElement);
                }

                this.textToSpeech(elementMessage);
            }
        });
    };

    textToSpeech(msg: string) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            this.speechUtterance.voice = this.voices[0];
            this.speechUtterance.volume = 1; // From 0 to 1
            this.speechUtterance.rate = 0.85; // From 0.1 to 10
            this.speechUtterance.pitch = 0.6; // From 0 to 2
            this.speechUtterance.lang = 'en-US';
            this.speechUtterance.text = msg;
            window.speechSynthesis.speak(this.speechUtterance);
        }
    };

    setInfoBubbleStyles(infoBubbleElem: HTMLElement, boundingRect: DOMRect) {
        infoBubbleElem.style.backgroundColor = '#6780FF';
        infoBubbleElem.style.color = '#FFFFFF';
        infoBubbleElem.style.fontSize = '14px';
        infoBubbleElem.style.border = '1px solid #6780FF';
        infoBubbleElem.style.borderRadius = '12px';
        infoBubbleElem.style.boxShadow = '2px 2px 2px #888888';
        infoBubbleElem.style.width = '235px';
        infoBubbleElem.style.padding = '12px';
        infoBubbleElem.style.position = 'absolute';
        infoBubbleElem.style.zIndex = '10';
        infoBubbleElem.style.top = `${boundingRect.top}px`;
        infoBubbleElem.style.left = `${boundingRect.left}px`;
    }

    hideInfoBubble() {
        if (this.activeInfoBubble){
            this.activeInfoBubble.remove();
        }
    }

    showInfoBubble(bubbleText: string, element: HTMLElement) {
        const boundingRect = element.getBoundingClientRect();

        this.activeInfoBubble = this.activeInfoBubble || document.createElement('div');

        this.activeInfoBubble.classList.add('info-bubble');
        this.activeInfoBubble.textContent = bubbleText;
        this.setInfoBubbleStyles(this.activeInfoBubble, boundingRect);

        element.appendChild(this.activeInfoBubble);

        setTimeout(() => {
            this.hideInfoBubble();
        }, 50000);
    }

    /* Temporary */

    getElementByXpath(xPath: string) {
        return document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    setSectionContainers() {
        const containers = {
            sideBar: this.getElementByXpath('/html/body/div[2]/div[2]'),
            topBarUserControls: this.getElementByXpath('/html/body/div[2]/div[3]/div[1]/div/div[2]'),
            steps: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[1]'),
            purchaseDetails: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[2]')
        };

        Object.keys(containers).forEach( (key) => {
            // @ts-ignore
            const container: HTMLElement = containers[key];

            if (container) {
                switch(key) {
                    case 'sideBar':
                        break;
                    case 'topBarUserControls':
                        container.setAttribute('alt', 'You have reached the upper navigation.\n' +
                            'Press Enter to skip to the next section');
                        break;
                    case 'steps':
                        container.setAttribute('alt', 'You have reached the steps navigation.\n' +
                            'Press Enter to skip to the next section');
                        break;
                    case 'purchaseDetails':
                        container.setAttribute('alt', 'You have reached the form content.\n' +
                            'Press Enter to skip to the next section');
                        break;
                }

                container.classList.add('section-container');
                container.setAttribute('tabindex', '0');
            }
        });
    };

    setFields() {
        const fields = {
            plusSign: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div[6]/div/div[1]/div/div[1]/div/div/tip-tooltip/div/tip-button/button'),
            howMuch: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[2]/div/div/div/div[2]/div[6]/div/div[1]/div/div[2]/div/tip-input-currency/tip-formrow/div[1]/div/tip-input-currency-field/input'),
        };

        Object.keys(fields).forEach( (key) => {
            // @ts-ignore
            const field: HTMLElement = fields[key];

            switch(key) {
                case 'howMuch':
                    field.setAttribute('alt', 'How much?');
                    break;
                case 'plusSign':
                    field.setAttribute('alt', 'Add line');
                    break;

            }
        });
    };

    /* /Temporary */

    init() {
        this.setSectionContainers();
        this.buildSection();
        this.attachEvents();
        this.setFields();
    }
}

const accessibilityEnabler = new AccessibilityEnabler();

accessibilityEnabler.init();
