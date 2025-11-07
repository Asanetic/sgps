import {mosyFlexSelect, toNum} from '../../../apiUtils/dataControl/dataUtils';

export async function GET() {
      // ✅ Provide default fallbacks
      const monthlyCollections = {
        tbl: 'milk_collections',
        colstr: btoa(" DATE_FORMAT(collection_date, '%Y-%m') as month , sum(quantity_litres) as value"), // default to *
        q : btoa("group by month order by month asc") 
      };

      // ✅ Provide default fallbacks
      const collectionByFarmer = {
        tbl: 'milk_collections',
        colstr: btoa(" farmer_id, sum(quantity_litres) as value"), // default to *
        q : btoa("group by farmer_id") 
      };
     

  
      //chart data  
      const monthlyCollectionsChart = await mosyFlexSelect(monthlyCollections);
  
      const collectionByFarmerChart = await mosyFlexSelect(collectionByFarmer, listMilkcollectionsRowMutationsKeys, MilkcollectionsRowMutations);

      const chartData = [
        // {
        //   title: "Ad by Merchant",
        //   chartType: "doughnut",
        //   dataKey: "_advertisers_business_name_advertiser_id",
        //   data: adByMerchantResult?.data ?? [],
        //   containerClass: "col-md-6"
        // },
        // {
        //   title: "Advertiser spending",
        //   chartType: "pie",
        //   dataKey: "_advertisers_business_name_advertiser_id",
        //   data: adByCategoryResult?.data ?? [],
        //   containerClass: "col-md-6"

        // },

        {
          title: "Monthly collection trend",
          chartType: "line",
          dataKey: "month",
          data: monthlyCollectionsChart?.data ?? [],
          series: [{ key: "value", color: "#1D951B", name: "Litres" }],
          height: 350,
          containerClass: "col-md-12"

        },


        {
          title: "Collection by farmer",
          chartType: "bar",
          dataKey: "_farmers_farmer_name_farmer_id",
          data: collectionByFarmerChart?.data ?? [],
          series: [{ key: "value", color: "#1D951B", name: "Litres" }],
          height: 350,
          containerClass: "col-md-12"

        },

      ];
      
      //card data 
      const card1 = await mosyFlexSelect({tbl:"farmers",colstr:btoa("count(*) as totals")})
      const collectionToday = await mosyFlexSelect({tbl:"milk_collections",colstr:btoa("sum(quantity_litres) as totals")})
      const collectionThisMonth = await mosyFlexSelect({tbl:"milk_collections",colstr:btoa("sum(quantity_litres) as totals")})

      //const totalGraders = await mosyFlexSelect({tbl:"graders",colstr:btoa("count(*) as totals")})

      const cardData = [
        {
          title: 'Farmers',
          value: `${card1?.data[0].totals || "0"}`,
          percentage: '',
          icon: "FaCopy",
        },
        {
          title: 'Total Collections',
          value: `${toNum((collectionToday?.data[0].totals || "0"))} Ltrs`,
          percentage: '',
          icon: "FaList",
        },
        {
          title: 'This month',
          value: `${toNum(collectionThisMonth?.data[0].totals || "0")} Ltrs`,
          percentage: '',
          icon: "FaCalendar",
        },
        {
          title: 'Total graders',
          value: `${toNum(collectionThisMonth?.data[0].totals || "0")} Ltrs`,
          percentage: '',
          icon: "FaUsers",
        },
      
      ];

      return Response.json({
        status: "success",
        message: "Chart data ready!",
        chart_data: chartData,
        cards_data: cardData,
      });

}
