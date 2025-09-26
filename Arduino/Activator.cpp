#include "Activator.h"
int buzzer = 4;
void alert() {
    tone(buzzer, 400, 500);
    tone(buzzer, 1000, 500);
}