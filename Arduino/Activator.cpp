#include "Activator.h"
int buzzer = 3;
void alert() {
    tone(buzzer, 400, 500);
    tone(buzzer, 1000, 500);
}