import SoftphoneService from './engage-voice-agent-softphone';
import SDK from 'imports-loader?exports=>false,define=>false,this=>window!./engage-voice-agent';

(global as any).SoftphoneService = SoftphoneService;
window.SoftphoneService = SoftphoneService;

export default SDK;
