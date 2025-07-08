import puppeteer from 'puppeteer';

export async function generatePdf(renderedHtml, outputFile = null, options = {}) {
    const {
        footerHtml = '',
        landscape = false,
        margins = { top: '60px', bottom: '20px' },
    } = options;

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: "A4",
        landscape,
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: footerHtml,
        headerTemplate: '<span></span>',
        margin: margins,
    });

    await browser.close();
    
    if (outputFile) {
        const fs = await import('fs/promises');
        await fs.writeFile(outputFile, pdfBuffer);
        return outputFile;
    }

    return pdfBuffer;
}