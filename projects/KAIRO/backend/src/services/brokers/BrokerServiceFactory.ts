import { BrokerType, BrokerCredentials } from '../../types/broker';
import { BaseBrokerService } from './BaseBrokerService';
import { AlpacaBrokerService } from './AlpacaBrokerService';

export class BrokerServiceFactory {
  static createBrokerService(brokerType: BrokerType, credentials: BrokerCredentials): BaseBrokerService {
    switch (brokerType) {
      case BrokerType.ALPACA:
        return new AlpacaBrokerService(credentials);
      
      case BrokerType.INTERACTIVE_BROKERS:
        throw new Error('Interactive Brokers integration not yet implemented');
      
      case BrokerType.TD_AMERITRADE:
        throw new Error('TD Ameritrade integration not yet implemented');
      
      case BrokerType.TRADIER:
        throw new Error('Tradier integration not yet implemented');
      
      case BrokerType.ROBINHOOD:
        throw new Error('Robinhood integration not yet implemented');
      
      case BrokerType.FIDELITY:
        throw new Error('Fidelity integration not yet implemented');
      
      case BrokerType.SCHWAB:
        throw new Error('Schwab integration not yet implemented');
      
      case BrokerType.ETRADE:
        throw new Error('E*TRADE integration not yet implemented');
      
      default:
        throw new Error(`Unsupported broker type: ${brokerType}`);
    }
  }

  static getSupportedBrokers(): BrokerType[] {
    return [BrokerType.ALPACA];
  }

  static isBrokerSupported(brokerType: BrokerType): boolean {
    return this.getSupportedBrokers().includes(brokerType);
  }
}