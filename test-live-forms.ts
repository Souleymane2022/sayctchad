async function testForms() {
    console.log("Testing Contact form...");
    const contactRes = await fetch("https://sayctchad.org/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: "Test",
            nomSpecifiqueUnique: "AutoBot",
            email: "test.sayctchad@yopmail.com", // dummy email to receive auto-reply
            subject: "Test Diagnostic Formulaire en ligne",
            message: "Ceci est un test automatisé pour s'assurer que le formulaire en ligne communique bien avec la base de données et le service email en production."
        })
    });

    const text = await contactRes.text();
    console.log(`Contact Form Status: ${contactRes.status} ${contactRes.statusText}`);
    console.log(`Response: ${text}\n`);

    console.log("Testing Join form...");
    const memberRes = await fetch("https://sayctchad.org/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: "Nouveau",
            nomSpecifiqueUnique: "Membre Test",
            email: "test.membre@yopmail.com",
            phone: "+23560000000",
            motivation: "Test d'adhésion depuis le bot."
        })
    });

    const memberText = await memberRes.text();
    console.log(`Member Form Status: ${memberRes.status} ${memberRes.statusText}`);
    console.log(`Response: ${memberText}`);
}

testForms().catch(console.error);
