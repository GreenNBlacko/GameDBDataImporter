import chalk from "chalk";

export default function printBanner() : void {
console.log(`
╔══════════════════════════════════════════════╗
║                                              ║
║            Game IS DB data importer          ║
║                  By ${chalk.hex("#008000").bold("Grayscale")}                ║
║                                              ║
╚══════════════════════════════════════════════╝
`);
}