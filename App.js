import React from 'react';
import { Root } from 'native-base';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LogBox, Text } from 'react-native';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as CartProvider } from './src/context/CartContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as ShopProvider } from './src/context/ShopContext';
import { Provider as TableProvider } from './src/context/TableContext';
import { Provider as PartnerProvider } from './src/context/PartnerContext';
import { Provider as PromotionProvider } from './src/context/PromotionContext';
import { Provider as ProteinProvider } from './src/context/ProteinContext';
import { Provider as CategoryProvider } from './src/context/CategoryContext';
import { Provider as MenuProvider } from './src/context/MenuContext';
import { Provider as SaleProvider } from './src/context/SaleContext';
import { Provider as PrinterProvider } from './src/context/PrinterContext';
import { Provider as ReportProvider } from './src/context/ReportContext';
import { Provider as SettingProvider } from './src/context/SettingContext';
import { navigate, setNavigator } from './src/navigationRef';

import HomeScreen from './src/screens/HomeScreen';
import SaleScreen from './src/screens/sales/SaleScreen';
import SaleRequestScreen from './src/screens/sales/SaleRequestScreen';
import SignInScreen from './src/screens/SignInScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import SettingScreen from './src/screens/settings/SettingScreen';
import CartScreen from './src/screens/carts/CartScreen';
import UserListScreen from './src/screens/settings/users/UserListScreen';
import UserCreateScreen from './src/screens/settings/users/UserCreateScreen';
import UserDetailScreen from './src/screens/settings/users/UserDetailScreen';
import TableListScreen from './src/screens/settings/tables/TableListScreen';
import TableCreateScreen from './src/screens/settings/tables/TableCreateScreen';
import UserResetPasswordScreen from './src/screens/settings/users/UserResetPasswordScreen';
import ShopManagementScreen from './src/screens/settings/shops/ShopManagementScreen';
import TableDetailScreen from './src/screens/settings/tables/TableDetailScreen';
import PartnerListScreen from './src/screens/settings/partners/PartnerListScreen';
import PartnerCreateScreen from './src/screens/settings/partners/PartnerCreateScreen';
import PartnerEditScreen from './src/screens/settings/partners/PartnerEditScreen';
import PromotionListScreen from './src/screens/settings/promotions/PromotionListScreen';
import PromotionEditScreen from './src/screens/settings/promotions/PromotionEditScreen';
import PromotionCreateScreen from './src/screens/settings/promotions/PromotionCreateScreen';
import ProductionMainScreen from './src/screens/settings/products/ProductionMainScreen';
import MenuListScreen from './src/screens/settings/products/MenuListScreen';
import MenuCreateScreen from './src/screens/settings/products/MenuCreateScreen';
import MenuEditScreen from './src/screens/settings/products/MenuEditScreen';
import ProteinListScreen from './src/screens/settings/products/ProteinListScreen';
import ProteinCreateScreen from './src/screens/settings/products/ProteinCreateScreen';
import ProteinEditScreen from './src/screens/settings/products/ProteinEditScreen';
import CategoryListScreen from './src/screens/settings/products/CategoryListScreen';
import CategoryCreateScreen from './src/screens/settings/products/CategoryCreateScreen';
import CategoryEditScreen from './src/screens/settings/products/CategoryEditScreen';
import SelectTableScreen from './src/screens/sales/SelectTableScreen';
import OrderListScreen from './src/screens/sales/OrderListScreen';
import PromotionScreen from './src/screens/carts/PromotionScreen';
import SelectPartnerScreen from './src/screens/sales/SelectPartnerScreen';
import SelectCustomerScreen from './src/screens/sales/SelectCustomerScreen';
import CreateCustomerScreen from './src/screens/sales/CreateCustomerScreen';
import OrderTypeModalScreen from './src/screens/sales/OrderTypeModalScreen';
import CheckoutScreen from './src/screens/carts/CheckoutScreen';
import PaymentModalScreen from './src/screens/carts/PaymentModalScreen';
import MergeTableScreen from './src/screens/carts/MergeTableScreen';
import ServiceModalScreen from './src/screens/carts/ServiceModalScreen';
import CashDrawerScreen from './src/screens/sales/CashDrawerScreen';
import CalculatorScreen from './src/screens/carts/CalculatorScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PrinterSettingScreen from './src/screens/settings/printers/PrinterSettingScreen';
import PrinterBillEditScreen from './src/screens/settings/printers/PrinterBillEditScreen';
import PrinterKitchenEditScreen from './src/screens/settings/printers/PrinterKitchenEditScreen';
import EditItemCartScreen from './src/screens/carts/EditItemCartScreen';
import DiscountItemScreen from './src/screens/carts/DiscountItemScreen';
import SelectProteinScreen from './src/screens/sales/SelectProteinScreen';
import CustomerOptionScreen from './src/screens/sales/CustomerOptionScreen';
import ReportScreen from './src/screens/reports/ReportScreen';
import DailySaleReportScreen from './src/screens/reports/DailySaleReportScreen';
import CalendarSearchScreen from './src/screens/reports/CalendarSearchScreen';
import FinalScreen from './src/screens/carts/FinalScreen';
import VoidScreen from './src/screens/sales/VoidScreen';
import DailySaleReportDetailScreen from './src/screens/reports/DailySaleReportDetailScreen';
import SummarySaleTransactionItemScreen from './src/screens/reports/SummarySaleTransactionItemScreen';
import SummarySaleItemReportScreen from './src/screens/reports/SummarySaleItemReportScreen';
import DailySalePartnerScreen from './src/screens/reports/DailySalePartnerScreen';
import CardServiceFeeScreen from './src/screens/settings/card-services-fee/CardServiceFeeScreen';
import ReductionReportScreen from './src/screens/reports/ReductionReportScreen';
import TipScreen from './src/screens/carts/TipScreen';
import SubSetMenuScreen from './src/screens/sales/SubSetMenuScreen';

LogBox.ignoreAllLogs();

const loginFlow = createStackNavigator({
  SignIn: SignInScreen,
});

const orderListFlow = createStackNavigator(
  {
    OrderList: {
      screen: () => (
        <SaleProvider>
          <OrderListScreen />
        </SaleProvider>
      ),
    },
    SelectTable: {
      screen: () => (
        <SaleProvider>
          <TableProvider>
            <SelectTableScreen />
          </TableProvider>
        </SaleProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Select Table',
      }),
    },
    SelectPartner: {
      screen: () => (
        <SaleProvider>
          <PartnerProvider>
            <SelectPartnerScreen />
          </PartnerProvider>
        </SaleProvider>
      ),
    },
    CustomerOption: {
      screen: () => (
        <SaleProvider>
          <PartnerProvider>
            <CustomerOptionScreen />
          </PartnerProvider>
        </SaleProvider>
      ),
    },
    SelectCustomer: {
      screen: () => (
        <SaleProvider>
          <SelectCustomerScreen />
        </SaleProvider>
      ),
    },
    CreateCustomer: {
      screen: () => (
        <SaleProvider>
          <CreateCustomerScreen />
        </SaleProvider>
      ),
    },
    Void: {
      screen: () => (
        <SaleProvider>
          <VoidScreen />
        </SaleProvider>
      ),
    },
  },
  {
    headerMode: 'none',
  }
);

const orderListRoot = createStackNavigator(
  {
    orderListFlow,
    OrderTypeModal: {
      screen: () => (
        <SaleProvider>
          <OrderTypeModalScreen />
        </SaleProvider>
      ),
    },
    CashDrawer: {
      screen: () => (
        <SaleProvider>
          <CashDrawerScreen />
        </SaleProvider>
      ),
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

orderListRoot.navigationOptions = {
  title: 'Order List',
  drawerIcon: <MaterialIcons name="point-of-sale" size={20} color="black" />,
};

const saleFlow = createStackNavigator(
  {
    Sale: {
      screen: () => (
        <CategoryProvider>
          <ProteinProvider>
            <SaleProvider>
              <SaleScreen />
            </SaleProvider>
          </ProteinProvider>
        </CategoryProvider>
      ),
    },
    SubSetMenu: {
      screen: () => (
        <CategoryProvider>
          <ProteinProvider>
            <SaleProvider>
              <SubSetMenuScreen />
            </SaleProvider>
          </ProteinProvider>
        </CategoryProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Select Sub Set Menu',
        headerStyle: {
          backgroundColor: 'green',
        },
        headerTintColor: 'white',
      }),
    },
    SaleRequest: {
      screen: () => (
        <SaleProvider>
          <SaleRequestScreen />
        </SaleProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'SALE (REQUEST / REMARK)',
      }),
    },
    SelectProtein: {
      screen: () => (
        <ProteinProvider>
          <SaleProvider>
            <SelectProteinScreen />
          </SaleProvider>
        </ProteinProvider>
      ),
    },
    Cart: {
      screen: () => (
        <PrinterProvider>
          <SaleProvider>
            <CartScreen />
          </SaleProvider>
        </PrinterProvider>
      ),
    },
    EditItemCart: {
      screen: () => (
        <SaleProvider>
          <EditItemCartScreen />
        </SaleProvider>
      ),
    },
    DiscountItem: {
      screen: () => (
        <SaleProvider>
          <DiscountItemScreen />
        </SaleProvider>
      ),
    },
    MergeTable: {
      screen: () => (
        <SaleProvider>
          <MergeTableScreen />
        </SaleProvider>
      ),
    },
    Promotion: {
      screen: () => (
        <SaleProvider>
          <PromotionProvider>
            <PromotionScreen />
          </PromotionProvider>
        </SaleProvider>
      ),
    },
    Checkout: {
      screen: () => (
        <ShopProvider>
          <PrinterProvider>
            <SaleProvider>
              <CheckoutScreen />
            </SaleProvider>
          </PrinterProvider>
        </ShopProvider>
      ),
    },
    Tip: {
      screen: () => (
        <ShopProvider>
          <SaleProvider>
            <TipScreen />
          </SaleProvider>
        </ShopProvider>
      ),
    },
    Final: {
      screen: () => (
        <PrinterProvider>
          <SaleProvider>
            <FinalScreen />
          </SaleProvider>
        </PrinterProvider>
      ),
    },
  },
  {
    // headerMode: 'none',
  }
);

const rootSaleFlow = createStackNavigator(
  {
    saleFlow,
    Payment: {
      screen: () => (
        <PrinterProvider>
          <SaleProvider>
            <PaymentModalScreen />
          </SaleProvider>
        </PrinterProvider>
      ),
    },
    ServiceCharge: {
      screen: () => (
        <PrinterProvider>
          <SaleProvider>
            <ServiceModalScreen />
          </SaleProvider>
        </PrinterProvider>
      ),
    },
    Calculator: {
      screen: () => <CalculatorScreen />,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

rootSaleFlow.navigationOptions = {
  title: 'Sale Order',
  tabBarIcon: <MaterialIcons name="point-of-sale" size={20} color="black" />,
  animationEnabled: false,
};

const settingFlow = createStackNavigator(
  {
    Setting: {
      screen: SettingScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Settings',
      }),
    },
    UserList: {
      screen: () => (
        <UserProvider>
          <UserListScreen />
        </UserProvider>
      ),
    },
    UserDetail: {
      screen: () => (
        <UserProvider>
          <UserDetailScreen />
        </UserProvider>
      ),
    },
    UserCreate: {
      screen: () => (
        <UserProvider>
          <UserCreateScreen />
        </UserProvider>
      ),
    },
    UserResetPassword: {
      screen: () => (
        <UserProvider>
          <UserResetPasswordScreen />
        </UserProvider>
      ),
    },
    ShopList: {
      screen: () => (
        <ShopProvider>
          <ShopManagementScreen />
        </ShopProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Shop Info Management',
      }),
    },
    TableCreate: {
      screen: () => (
        <TableProvider>
          <TableCreateScreen />
        </TableProvider>
      ),
    },
    TableList: {
      screen: () => (
        <TableProvider>
          <TableListScreen />
        </TableProvider>
      ),
    },
    TableDetail: {
      screen: () => (
        <TableProvider>
          <TableDetailScreen />
        </TableProvider>
      ),
    },
    PartnerList: {
      screen: () => (
        <PartnerProvider>
          <PartnerListScreen />
        </PartnerProvider>
      ),
    },
    PartnerCreate: {
      screen: () => (
        <PartnerProvider>
          <PartnerCreateScreen />
        </PartnerProvider>
      ),
    },
    PartnerEdit: {
      screen: () => (
        <PartnerProvider>
          <PartnerEditScreen />
        </PartnerProvider>
      ),
    },
    PromotionList: {
      screen: () => (
        <PromotionProvider>
          <PromotionListScreen />
        </PromotionProvider>
      ),
    },
    PromotionCreate: {
      screen: () => (
        <PromotionProvider>
          <PromotionCreateScreen />
        </PromotionProvider>
      ),
      navigationOptions: {
        title: 'Promotion Create',
      },
    },
    PromotionEdit: {
      screen: () => (
        <PromotionProvider>
          <PromotionEditScreen />
        </PromotionProvider>
      ),
      navigationOptions: {
        title: 'Promotion Edit',
      },
    },
    ProductionMain: {
      screen: () => <ProductionMainScreen />,
    },
    MenuList: {
      screen: () => (
        <MenuProvider>
          <MenuListScreen />
        </MenuProvider>
      ),
    },
    MenuCreate: {
      screen: () => (
        <MenuProvider>
          <PrinterProvider>
            <CategoryProvider>
              <MenuCreateScreen />
            </CategoryProvider>
          </PrinterProvider>
        </MenuProvider>
      ),
    },
    MenuEdit: {
      screen: () => (
        <MenuProvider>
          <PrinterProvider>
            <CategoryProvider>
              <MenuEditScreen />
            </CategoryProvider>
          </PrinterProvider>
        </MenuProvider>
      ),
    },
    ProteinList: {
      screen: () => (
        <ProteinProvider>
          <ProteinListScreen />
        </ProteinProvider>
      ),
    },
    ProteinCreate: {
      screen: () => (
        <ProteinProvider>
          <ProteinCreateScreen />
        </ProteinProvider>
      ),
    },
    ProteinEdit: {
      screen: () => (
        <ProteinProvider>
          <ProteinEditScreen />
        </ProteinProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Create Protein',
      }),
    },
    CategoryList: {
      screen: () => (
        <CategoryProvider>
          <CategoryListScreen />
        </CategoryProvider>
      ),
    },
    CategoryCreate: {
      screen: () => (
        <CategoryProvider>
          <CategoryCreateScreen />
        </CategoryProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Create Category',
      }),
    },
    CategoryEdit: {
      screen: () => (
        <CategoryProvider>
          <CategoryEditScreen />
        </CategoryProvider>
      ),
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Edit Category',
      }),
    },
    PrinterBillEdit: {
      screen: () => (
        <PrinterProvider>
          <PrinterBillEditScreen />
        </PrinterProvider>
      ),
    },
    PrinterKitchenEdit: {
      screen: () => (
        <PrinterProvider>
          <PrinterKitchenEditScreen />
        </PrinterProvider>
      ),
    },
    PrinterSettings: {
      screen: () => (
        <PrinterProvider>
          <PrinterSettingScreen />
        </PrinterProvider>
      ),
    },
    CardServiceFeeScreen: {
      screen: () => (
        <SettingProvider>
          <CardServiceFeeScreen />
        </SettingProvider>
      ),
    },
  },
  {
    headerMode: 'none',
  }
);

settingFlow.navigationOptions = {
  title: 'Settings',
  drawerIcon: <MaterialIcons name="settings" size={20} color="black" />,
};

const reportFlow = createStackNavigator(
  {
    Report: {
      screen: () => <ReportScreen />,
    },
    DailySaleReport: {
      screen: () => (
        <PrinterProvider>
          <ReportProvider>
            <DailySaleReportScreen />
          </ReportProvider>
        </PrinterProvider>
      ),
    },
    DailySalePartnerScreen: {
      screen: () => (
        <ReportProvider>
          <DailySalePartnerScreen />
        </ReportProvider>
      ),
    },
    DailySaleReportDetail: {
      screen: () => (
        <ReportProvider>
          <DailySaleReportDetailScreen />
        </ReportProvider>
      ),
    },
    SummarySaleTransactionItemScreen: {
      screen: () => (
        <ReportProvider>
          <ProteinProvider>
            <SummarySaleTransactionItemScreen />
          </ProteinProvider>
        </ReportProvider>
      ),
    },
    CalendarSearch: {
      screen: () => (
        <ReportProvider>
          <CalendarSearchScreen />
        </ReportProvider>
      ),
    },
    SaleItemScreen: {
      screen: () => (
        <ReportProvider>
          <MenuProvider>
            <SummarySaleItemReportScreen />
          </MenuProvider>
        </ReportProvider>
      ),
    },
    ReductionReportScreen: {
      screen: () => (
        <ReportProvider>
          <SettingProvider>
            <PartnerProvider>
              <ReductionReportScreen />
            </PartnerProvider>
          </SettingProvider>
        </ReportProvider>
      ),
    },
  },
  {
    headerMode: 'node',
  }
);

reportFlow.navigationOptions = {
  title: 'Report',
  drawerIcon: (
    <MaterialIcons name="dashboard-customize" size={20} color="black" />
  ),
};

const mainRootFlow = createDrawerNavigator({
  orderListRoot,
  reportFlow,
  settingFlow,
  Profile: {
    screen: () => <ProfileScreen />,
    navigationOptions: {
      drawerIcon: (
        <MaterialCommunityIcons name="face-profile" size={20} color="black" />
      ),
    },
  },
});

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow,
  mainRootFlow,
  rootSaleFlow,
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <Root>
      <SafeAreaProvider>
        <AuthProvider>
          <SettingProvider>
            <CartProvider>
              <App
                ref={(navigator) => {
                  setNavigator(navigator);
                }}
              />
            </CartProvider>
          </SettingProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </Root>
  );
};
