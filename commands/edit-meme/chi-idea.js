const Command = require('../../structures/Command');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const { wrapText } = require('../../util/Canvas');

module.exports = class ChiIdeaCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'chi-idea',
			aliases: ['idea', 'takagi-idea', 'i-have-an-idea'],
			group: 'edit-meme',
			memberName: 'chi-idea',
			description: 'Sends a "Daddy, I\'ve got an idea!" Takagi-san meme with the text of your choice.',
			throttling: {
				usages: 1,
				duration: 10
			},
			clientPermissions: ['ATTACH_FILES'],
			args: [
				{
					key: 'text',
					prompt: 'What is Chi\'s idea?',
					type: 'string',
					max: 100
				}
			]
		});
	}

	async run(msg, { text }) {
		const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'chi-idea.png'));
		const canvas = createCanvas(base.width, base.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(base, 0, 0);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = this.client.fonts.get('wildwordsroman.ttf').toCanvasString(15);
		let fontSize = 15;
		while (ctx.measureText(text).width > 500) {
			fontSize--;
			ctx.font = this.client.fonts.get('wildwordsroman.ttf').toCanvasString(fontSize);
		}
		const lines = await wrapText(ctx, text, 83);
		const topMost = 137 - (((fontSize * lines.length) / 2) + ((5 * (lines.length - 1)) / 2));
		for (let i = 0; i < lines.length; i++) {
			const height = topMost + ((fontSize + 5) * i);
			ctx.fillText(lines[i], 70, height);
		}
		return msg.say({ files: [{ attachment: canvas.toBuffer(), name: 'chi-idea.png' }] });
	}
};
