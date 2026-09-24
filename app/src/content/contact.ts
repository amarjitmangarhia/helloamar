// PLACEHOLDER: timezone defaults to the design's own default (Europe/London). Set it to the
// owner's real IANA zone (e.g. 'America/Toronto') once decided — see content/site.ts for the
// matching placeholder city/country shown next to the clock.
export const ownerTimezone = 'Europe/London'

export const contact = {
  eyebrow: 'Contact',
  title: 'Send me a signal.',
  lead: "Got a role, a project, or a question about black holes? I'd love to hear it.",
  openTo: 'Full-time roles, freelance and collaborations',
  replyTime: 'Usually within 2 days',
}

export const contactSent = (firstName: string) =>
  `Thanks, ${firstName}. Your message travelled at the speed of light, so it has already arrived. I'll get back to you within 2 days.`
