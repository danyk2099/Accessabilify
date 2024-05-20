class AccessibilityEnabler {
        activeInfoBubble;
        voices;
        speechMessage;

     constructor() {
         this.voices = window.speechSynthesis.getVoices();
         this.speechMessage = new SpeechSynthesisUtterance();
     }

     buildSection()  {
        document.querySelectorAll('.section-container')
            .forEach((section, index) => {
                section.setAttribute('data-section', `section-${index + 1}`);
            });
    };

     attachEvents()  {
        document.addEventListener('keyup', (event) => {
            const focusElement = document.activeElement;

            if (event.key === 'Enter') {
                if (document.body.classList.contains('active-tabulation')) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    console.log(focusElement.dataset['section'] );

                    const currentSectionNumber = parseInt(focusElement.dataset['section']
                        .split('-')[1], 10);

                    const nextSection = document.querySelector(`[data-section="section-${currentSectionNumber + 1}"]`);

                    if (nextSection) {
                        nextSection.focus();
                    } else {
                        document.querySelector('[data-section="section-1"]').focus();
                    }
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

     textToSpeech(msg) {
         if ('speechSynthesis' in window) {
             this.speechMessage.voice = this.voices[0];
             this.speechMessage.volume = 1; // From 0 to 1
             this.speechMessage.rate = 0.85; // From 0.1 to 10
             this.speechMessage.pitch = 0.6; // From 0 to 2
             this.speechMessage.lang = 'en-US';
             this.speechMessage.text = msg;
             window.speechSynthesis.speak(this.speechMessage);
         }
    };

     hideInfoBubble() {
         if (this.activeInfoBubble){
             this.activeInfoBubble.remove();
         }
     }

     showInfoBubble(bubbleText, element) {
         this.activeInfoBubble = this.activeInfoBubble || document.createElement('div');

         this.activeInfoBubble.classList.add('info-bubble');
         this.activeInfoBubble.textContent = bubbleText;

         element.appendChild(this.activeInfoBubble);

         setTimeout(() => {
             this.hideInfoBubble();
         }, 5000);
     }

    /* Temporary */

     getElementByXpath(xPath) {
        return document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

     setSectionContainers () {
        const containers = {
            sideBar: this.getElementByXpath('/html/body/div[2]/div[2]/div'),
            sideBarHamburgerMenu: this.getElementByXpath('/html/body/div[2]/div[2]/div/div/section/aside/div/div/div'),
            topBar: this.getElementByXpath('/html/body/div[2]/div[3]/div[1]/div'),
            steps: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[1]'),
            purchaseDetails: this.getElementByXpath('/html/body/div[2]/div[3]/div[2]/div[19]/div[2]/div/div/div[1]/div[2]')
        };

        Object.keys(containers).forEach( (key) => {
            const container = containers[key];

            if (container) {
                container.classList.add('section-container');
                container.setAttribute('tabindex', '0');
            }
        });
    };

    /* /Temporary */

    init() {
        this.setSectionContainers();
        this.buildSection();
        this.attachEvents();
    }
}

const accessibilityEnabler = new AccessibilityEnabler();

accessibilityEnabler.init();

