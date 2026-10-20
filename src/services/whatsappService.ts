export const SHOP_NAME_EN = 'Sahyadri Wholesale Fataka, Lonand';
export const SHOP_NAME_MR = 'सह्याद्री होलसेल फटाका, लोणंद';

/** Sweet welcome message in English and Marathi. Deliberately contains no bill details. */
export function buildGreeting(): string {
  return [
    `प्रिय ग्राहक,`,
    `सह्याद्री परिवारात सामील झाल्याबद्दल मनापासून धन्यवाद! 🎆 आपण आमच्यासोबत आहात याचा आम्हाला खूप आनंद आहे. आपल्याला आणि आपल्या कुटुंबाला आनंदी, सुरक्षित आणि प्रकाशमय सणाच्या शुभेच्छा! आपले नम्र, टीम ${SHOP_NAME_MR}.`,
  ].join('\n');
}

/** Opens a chat with this number even if it is not saved in the phone's contacts. */
export function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
